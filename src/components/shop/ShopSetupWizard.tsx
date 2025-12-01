"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Store, MapPin, Phone, FileText, Truck, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { ShopCategory } from "@prisma/client";

const STEPS = [
  { id: 1, title: "Basic Info", icon: Store },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Contact", icon: Phone },
  { id: 4, title: "Business Details", icon: FileText },
  { id: 5, title: "Delivery", icon: Truck },
];

const SHOP_CATEGORIES = [
  { value: "PET_STORE", label: "Pet Store", description: "Sell pet products and supplies" },
  // Service categories coming soon!
  // { value: "GROOMING", label: "Grooming Service", description: "Pet grooming and spa services" },
  // { value: "VETERINARY_CLINIC", label: "Veterinary Clinic", description: "Pet healthcare services" },
  // { value: "BOARDING", label: "Pet Boarding", description: "Pet sitting and boarding services" },
];

const ISLANDS = ["Male'", "Hulhumale Phase 1", "Hulhumale Phase 2", "Villimale"];
const ATOLLS = ["K"];

const DAYS = [
  { value: "MON", label: "Monday" },
  { value: "TUE", label: "Tuesday" },
  { value: "WED", label: "Wednesday" },
  { value: "THU", label: "Thursday" },
  { value: "FRI", label: "Friday" },
  { value: "SAT", label: "Saturday" },
  { value: "SUN", label: "Sunday" },
];

interface DeliveryZone {
  area: string;
  fee: number;
}

interface BusinessHours {
  days: string[];
  openTime: string;
  closeTime: string;
}

interface ShopData {
  name: string;
  description: string;
  category: ShopCategory | "";
  island: string;
  atoll: string;
  address: string;
  phone: string;
  email: string;
  license: string;
  businessHours: BusinessHours;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  deliveryZones: DeliveryZone[];
}

export default function ShopSetupWizard() {
  const router = useRouter();
  const { status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shopData, setShopData] = useState<ShopData>({
    name: "",
    description: "",
    category: "",
    island: "",
    atoll: "",
    address: "",
    phone: "",
    email: "",
    license: "",
    businessHours: {
      days: [],
      openTime: "09:00",
      closeTime: "17:00",
    },
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    deliveryZones: [],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const updateShopData = (field: keyof ShopData, value: string | string[] | BusinessHours | DeliveryZone[]) => {
    setShopData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleDay = (day: string) => {
    const currentDays = shopData.businessHours.days;
    const newDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day];
    updateShopData("businessHours", { ...shopData.businessHours, days: newDays });
  };

  const toggleDeliveryZone = (area: string) => {
    const exists = shopData.deliveryZones.find((z) => z.area === area);
    if (exists) {
      updateShopData(
        "deliveryZones",
        shopData.deliveryZones.filter((z) => z.area !== area)
      );
    } else {
      updateShopData("deliveryZones", [...shopData.deliveryZones, { area, fee: 0 }]);
    }
  };

  const updateDeliveryFee = (area: string, fee: number) => {
    updateShopData(
      "deliveryZones",
      shopData.deliveryZones.map((z) => (z.area === area ? { ...z, fee } : z))
    );
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!shopData.name.trim()) {
          setError("Shop name is required");
          return false;
        }
        if (!shopData.description.trim()) {
          setError("Shop description is required");
          return false;
        }
        if (!shopData.category) {
          setError("Shop category is required");
          return false;
        }
        break;
      case 2:
        if (!shopData.island) {
          setError("Island is required");
          return false;
        }
        if (!shopData.atoll) {
          setError("Atoll is required");
          return false;
        }
        if (!shopData.address.trim()) {
          setError("Address is required");
          return false;
        }
        break;
      case 3:
        if (!shopData.phone.trim()) {
          setError("Phone number is required");
          return false;
        }
        if (!/^[79]\d{6}$/.test(shopData.phone)) {
          setError("Invalid phone number format");
          return false;
        }
        break;
      case 4:
        // Optional fields, no validation needed
        break;
      case 5:
        // Delivery zones are optional, no validation needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/shop/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create shop");
      }

      router.push("/shop/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-cream-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Set Up Your Shop</h1>
        <p className="text-muted-foreground">Complete the steps below to start selling on Pet Realm</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={progress} className="mb-4" />
        <div className="flex justify-between">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? "bg-green-500 text-white" : isActive ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                  }`}>
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <span className={`text-xs text-center ${isActive ? "font-medium" : ""}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {STEPS[currentStep - 1] && React.createElement(STEPS[currentStep - 1]!.icon, { className: "h-5 w-5" })}
            Step {currentStep}: {STEPS[currentStep - 1]?.title}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Tell us about your shop"}
            {currentStep === 2 && "Where is your shop located?"}
            {currentStep === 3 && "How can customers reach you?"}
            {currentStep === 4 && "Additional business information"}
            {currentStep === 5 && "Set up delivery options"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Paws & Claws Pet Store"
                  value={shopData.name}
                  onChange={(e) => updateShopData("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Shop Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your shop offers..."
                  rows={4}
                  value={shopData.description}
                  onChange={(e) => updateShopData("description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Shop Category *</Label>
                <RadioGroup value={shopData.category} onValueChange={(value) => updateShopData("category", value)}>
                  {SHOP_CATEGORIES.map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={cat.value} id={cat.value} />
                      <Label htmlFor={cat.value} className="flex-1 cursor-pointer">
                        <div className="font-medium">{cat.label}</div>
                        <div className="text-sm text-muted-foreground">{cat.description}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="island">Island *</Label>
                  <select
                    id="island"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={shopData.island}
                    onChange={(e) => updateShopData("island", e.target.value)}>
                    <option value="">Select island</option>
                    {ISLANDS.map((island) => (
                      <option key={island} value={island}>
                        {island}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="atoll">Atoll *</Label>
                  <select
                    id="atoll"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={shopData.atoll}
                    onChange={(e) => updateShopData("atoll", e.target.value)}>
                    <option value="">Select atoll</option>
                    {ATOLLS.map((atoll) => (
                      <option key={atoll} value={atoll}>
                        {atoll}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your shop's complete address..."
                  rows={3}
                  value={shopData.address}
                  onChange={(e) => updateShopData("address", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 3: Contact */}
          {currentStep === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="7xxxxxx or 9xxxxxx" value={shopData.phone} onChange={(e) => updateShopData("phone", e.target.value)} />
                <p className="text-xs text-muted-foreground">Enter a valid Maldivian phone number (7 digits starting with 7 or 9)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="shop@example.com"
                  value={shopData.email}
                  onChange={(e) => updateShopData("email", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 4: Business Details */}
          {currentStep === 4 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="license">Business License (Optional)</Label>
                <Input
                  id="license"
                  placeholder="Enter your business license number"
                  value={shopData.license}
                  onChange={(e) => updateShopData("license", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Business Hours (Optional)</Label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {DAYS.map((day) => (
                      <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shopData.businessHours.days.includes(day.value)}
                          onChange={() => toggleDay(day.value)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                  {shopData.businessHours.days.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openTime">Opening Time</Label>
                        <Input
                          id="openTime"
                          type="time"
                          value={shopData.businessHours.openTime}
                          onChange={(e) => updateShopData("businessHours", { ...shopData.businessHours, openTime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="closeTime">Closing Time</Label>
                        <Input
                          id="closeTime"
                          type="time"
                          value={shopData.businessHours.closeTime}
                          onChange={(e) => updateShopData("businessHours", { ...shopData.businessHours, closeTime: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">Bank Account Information</h3>
                  <span className="text-xs text-muted-foreground">(Required for receiving payments)</span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    placeholder="e.g., Bank of Maldives"
                    value={shopData.bankName}
                    onChange={(e) => updateShopData("bankName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    placeholder="Name as it appears on bank account"
                    value={shopData.accountHolderName}
                    onChange={(e) => updateShopData("accountHolderName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="Bank account number"
                    value={shopData.accountNumber}
                    onChange={(e) => updateShopData("accountNumber", e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Logo and banner images can be uploaded later from your shop settings.
                </p>
              </div>
            </>
          )}

          {/* Step 5: Delivery */}
          {currentStep === 5 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>Delivery Zones (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select areas you deliver to and set individual delivery fees</p>
                </div>
                <div className="space-y-3">
                  {ISLANDS.map((island) => {
                    const zone = shopData.deliveryZones.find((z) => z.area === island);
                    const isSelected = !!zone;

                    return (
                      <div key={island} className="flex items-center gap-4 p-3 border rounded-lg">
                        <label className="flex items-center space-x-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleDeliveryZone(island)}
                            className="rounded border-gray-300"
                          />
                          <span className="font-medium">{island}</span>
                        </label>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`fee-${island}`} className="text-sm whitespace-nowrap">
                              Fee (MVR):
                            </Label>
                            <Input
                              id={`fee-${island}`}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={zone.fee || ""}
                              onChange={(e) => updateDeliveryFee(island, parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground">
                  Set fee to 0 for free delivery. Leave unchecked if you don&apos;t deliver to that area.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-900">
                  <strong>Ready to launch!</strong> Click &ldquo;Complete Setup&rdquo; to create your shop and start selling.
                </p>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || loading}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} disabled={loading}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Shop...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
