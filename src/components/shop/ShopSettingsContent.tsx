"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, MapPin, Briefcase, CreditCard, User, ArrowLeft, Loader2, X, Upload, RefreshCw } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ShopCategory } from "@prisma/client";

const SHOP_CATEGORIES = [
  { value: "PET_STORE", label: "Pet Store" },
  { value: "GROOMING", label: "Grooming Service" },
  { value: "VETERINARY_CLINIC", label: "Veterinary Clinic" },
  { value: "BOARDING", label: "Pet Boarding" },
];

const ISLANDS = ["Male'", "Hulhumale Phase 1", "Hulhumale Phase 2", "Villimale"];
const ATOLLS = ["Kaafu"];

const DAYS = [
  { value: "MON", label: "Mon" },
  { value: "TUE", label: "Tue" },
  { value: "WED", label: "Wed" },
  { value: "THU", label: "Thu" },
  { value: "FRI", label: "Fri" },
  { value: "SAT", label: "Sat" },
  { value: "SUN", label: "Sun" },
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

export default function ShopSettingsContent() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Shop Info State
  const [shopInfoForm, setShopInfoForm] = useState({
    name: "",
    description: "",
    category: "" as ShopCategory,
    logo: "",
    banner: "",
  });

  // Location & Contact State
  const [locationForm, setLocationForm] = useState({
    island: "",
    atoll: "K",
    address: "",
    phone: "",
    email: "",
  });

  // Business Details State
  const [businessForm, setBusinessForm] = useState({
    license: "",
    businessHours: {
      days: [] as string[],
      openTime: "09:00",
      closeTime: "17:00",
    } as BusinessHours,
    deliveryZones: [] as DeliveryZone[],
  });

  // Bank Info State
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
  });

  // Account Settings State
  const [accountForm, setAccountForm] = useState({
    name: "",
    email: "",
  });

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Upload state for logo and banner
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);

  useEffect(() => {
    fetchShopData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shop/settings");

      if (!response.ok) {
        if (response.status === 404) {
          router.push("/shop/setup");
          return;
        }
        throw new Error("Failed to fetch shop data");
      }

      const data = await response.json();

      // Populate forms
      setShopInfoForm({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "PET_STORE",
        logo: data.logo || "",
        banner: data.banner || "",
      });

      setLocationForm({
        island: data.island || "",
        atoll: data.atoll || "K",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
      });

      setBusinessForm({
        license: data.license || "",
        businessHours: data.businessHours || { days: [], openTime: "09:00", closeTime: "17:00" },
        deliveryZones: data.deliveryZones || [],
      });

      setBankForm({
        bankName: data.bankName || "",
        accountHolderName: data.accountHolderName || "",
        accountNumber: data.accountNumber || "",
      });

      // Account form will be populated separately when session is available
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shop data");
    } finally {
      setLoading(false);
    }
  };

  // Populate account form when session is loaded
  useEffect(() => {
    if (session?.user) {
      setAccountForm({
        name: session.user.name || "",
        email: session.user.email || "",
      });
    }
  }, [session]);

  const handleShopInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch("/api/shop/settings/info", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shopInfoForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update shop information");
      }

      setSuccess("Shop information updated successfully!");
      await fetchShopData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update shop information");
    } finally {
      setSaving(false);
    }
  };

  const handleLocationUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch("/api/shop/settings/location", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update location");
      }

      setSuccess("Location and contact information updated successfully!");
      await fetchShopData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update location");
    } finally {
      setSaving(false);
    }
  };

  const handleBusinessUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch("/api/shop/settings/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update business details");
      }

      setSuccess("Business details updated successfully!");
      await fetchShopData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update business details");
    } finally {
      setSaving(false);
    }
  };

  const handleBankInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch("/api/shop/settings/bank", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update bank information");
      }

      setSuccess("Bank information updated successfully!");
      await fetchShopData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update bank information");
    } finally {
      setSaving(false);
    }
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update account");
      }

      setSuccess("Account updated successfully!");
      await update();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update account");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    const currentDays = businessForm.businessHours.days;
    const newDays = currentDays.includes(day) ? currentDays.filter((d) => d !== day) : [...currentDays, day];
    setBusinessForm({
      ...businessForm,
      businessHours: { ...businessForm.businessHours, days: newDays },
    });
  };

  const toggleDeliveryZone = (area: string) => {
    const exists = businessForm.deliveryZones.find((z) => z.area === area);
    if (exists) {
      setBusinessForm({
        ...businessForm,
        deliveryZones: businessForm.deliveryZones.filter((z) => z.area !== area),
      });
    } else {
      setBusinessForm({
        ...businessForm,
        deliveryZones: [...businessForm.deliveryZones, { area, fee: 0 }],
      });
    }
  };

  const updateDeliveryFee = (area: string, fee: number) => {
    setBusinessForm({
      ...businessForm,
      deliveryZones: businessForm.deliveryZones.map((z) => (z.area === area ? { ...z, fee } : z)),
    });
  };

  const handleImageUpload = async (type: "logo" | "banner", file: File) => {
    setError(null);
    setSuccess(null);
    setUploading(type);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/shop/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await response.json();

      // Update the form state with the new URL
      setShopInfoForm({ ...shopInfoForm, [type]: data.url });
      setSuccess(`${type === "logo" ? "Logo" : "Banner"} uploaded successfully!`);
      await fetchShopData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (type: "logo" | "banner", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be smaller than 5MB");
        return;
      }
      handleImageUpload(type, file);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
        <LoadingState message="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/shop/dashboard")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Shop Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your shop information and preferences</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

        {success && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">{success}</div>}

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">
              <Store className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="location">
              <MapPin className="w-4 h-4 mr-2" />
              Location
            </TabsTrigger>
            <TabsTrigger value="business">
              <Briefcase className="w-4 h-4 mr-2" />
              Business
            </TabsTrigger>
            <TabsTrigger value="bank">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Shop Information Tab */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Shop Information</CardTitle>
                <CardDescription>Update your shop&apos;s basic information and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShopInfoUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="shop-name" className="mb-2">
                      Shop Name *
                    </Label>
                    <Input
                      id="shop-name"
                      value={shopInfoForm.name}
                      onChange={(e) => setShopInfoForm({ ...shopInfoForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="mb-2">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={shopInfoForm.description}
                      onChange={(e) => setShopInfoForm({ ...shopInfoForm, description: e.target.value })}
                      rows={4}
                      placeholder="Tell customers about your shop..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="mb-2">
                      Category *
                    </Label>
                    <Select
                      value={shopInfoForm.category}
                      onValueChange={(value) => setShopInfoForm({ ...shopInfoForm, category: value as ShopCategory })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOP_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>Shop Logo</Label>
                      <p className="text-sm text-muted-foreground my-2">Upload a square image (recommended 400x400px, max 5MB)</p>
                      <div className="mt-2 space-y-2">
                        {shopInfoForm.logo ? (
                          <div className="space-y-2">
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={shopInfoForm.logo} alt="Shop logo" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-2">
                              <Input
                                id="replace-logo"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => handleFileChange("logo", e)}
                                disabled={uploading === "logo"}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById("replace-logo")?.click()}
                                disabled={uploading === "logo"}>
                                {uploading === "logo" ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Replace Logo
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setShopInfoForm({ ...shopInfoForm, logo: "" })}
                                disabled={uploading === "logo"}>
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              id="upload-logo"
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              onChange={(e) => handleFileChange("logo", e)}
                              disabled={uploading === "logo"}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("upload-logo")?.click()}
                              disabled={uploading === "logo"}>
                              {uploading === "logo" ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload Logo
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Label>Shop Banner</Label>
                      <p className="text-sm text-muted-foreground my-2">Upload a wide image (recommended 1200x400px, max 5MB)</p>
                      <div className="mt-2 space-y-2">
                        {shopInfoForm.banner ? (
                          <div className="space-y-2">
                            <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={shopInfoForm.banner} alt="Shop banner" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex gap-2">
                              <Input
                                id="replace-banner"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={(e) => handleFileChange("banner", e)}
                                disabled={uploading === "banner"}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById("replace-banner")?.click()}
                                disabled={uploading === "banner"}>
                                {uploading === "banner" ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-1" />
                                    Replace Banner
                                  </>
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setShopInfoForm({ ...shopInfoForm, banner: "" })}
                                disabled={uploading === "banner"}>
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              id="upload-banner"
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              onChange={(e) => handleFileChange("banner", e)}
                              disabled={uploading === "banner"}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("upload-banner")?.click()}
                              disabled={uploading === "banner"}>
                              {uploading === "banner" ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload Banner
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location & Contact Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location & Contact</CardTitle>
                <CardDescription>Update your shop&apos;s location and contact information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLocationUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="island" className="mb-2">
                        Island *
                      </Label>
                      <Select value={locationForm.island} onValueChange={(value) => setLocationForm({ ...locationForm, island: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select island" />
                        </SelectTrigger>
                        <SelectContent>
                          {ISLANDS.map((island) => (
                            <SelectItem key={island} value={island}>
                              {island}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="atoll" className="mb-2">
                        Atoll *
                      </Label>
                      <Select value={locationForm.atoll || "K"} onValueChange={(value) => setLocationForm({ ...locationForm, atoll: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select atoll" />
                        </SelectTrigger>
                        <SelectContent>
                          {ATOLLS.map((atoll) => (
                            <SelectItem key={atoll} value={atoll}>
                              {atoll}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="mb-2">
                      Physical Address *
                    </Label>
                    <Textarea
                      id="address"
                      value={locationForm.address}
                      onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                      rows={2}
                      placeholder="Street address, building, landmarks..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="mb-2">
                      Phone *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={locationForm.phone}
                      onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location-email" className="mb-2">
                      Shop Email
                    </Label>
                    <Input
                      id="location-email"
                      type="email"
                      value={locationForm.email}
                      onChange={(e) => setLocationForm({ ...locationForm, email: e.target.value })}
                      placeholder="Optional - public contact email"
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Details Tab */}
          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Manage business hours, delivery zones, and licensing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBusinessUpdate} className="space-y-6">
                  <div>
                    <Label htmlFor="license" className="mb-2">
                      Business License (Optional)
                    </Label>
                    <Input
                      id="license"
                      value={businessForm.license}
                      onChange={(e) => setBusinessForm({ ...businessForm, license: e.target.value })}
                      placeholder="Business license number"
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <Label>Business Hours (Optional)</Label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {DAYS.map((day) => (
                          <label key={day.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={businessForm.businessHours.days.includes(day.value)}
                              onChange={() => toggleDay(day.value)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">{day.label}</span>
                          </label>
                        ))}
                      </div>
                      {businessForm.businessHours.days.length > 0 && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="openTime">Opening Time</Label>
                            <Input
                              id="openTime"
                              type="time"
                              value={businessForm.businessHours.openTime}
                              onChange={(e) =>
                                setBusinessForm({
                                  ...businessForm,
                                  businessHours: { ...businessForm.businessHours, openTime: e.target.value },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="closeTime">Closing Time</Label>
                            <Input
                              id="closeTime"
                              type="time"
                              value={businessForm.businessHours.closeTime}
                              onChange={(e) =>
                                setBusinessForm({
                                  ...businessForm,
                                  businessHours: { ...businessForm.businessHours, closeTime: e.target.value },
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label>Delivery Zones (Optional)</Label>
                      <p className="text-sm text-muted-foreground mb-3">Select areas you deliver to and set individual delivery fees</p>
                    </div>
                    <div className="space-y-3">
                      {ISLANDS.map((island) => {
                        const zone = businessForm.deliveryZones.find((z) => z.area === island);
                        const isSelected = !!zone;

                        return (
                          <div key={island} className="flex items-center gap-4 p-3 border rounded-lg">
                            <label className="flex items-center space-x-2 cursor-pointer flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleDeliveryZone(island)}
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
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
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Details Tab */}
          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>Bank account information for receiving payments</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBankInfoUpdate} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      This information will be shown to customers when they place orders, so they know where to transfer payment.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bank-name" className="mb-2">
                      Bank Name
                    </Label>
                    <Input
                      id="bank-name"
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      placeholder="e.g., Bank of Maldives"
                    />
                  </div>

                  <div>
                    <Label htmlFor="account-holder" className="mb-2">
                      Account Holder Name
                    </Label>
                    <Input
                      id="account-holder"
                      value={bankForm.accountHolderName}
                      onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                      placeholder="Full name as on bank account"
                    />
                  </div>

                  <div>
                    <Label htmlFor="account-number" className="mb-2">
                      Account Number
                    </Label>
                    <Input
                      id="account-number"
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      placeholder="Your bank account number"
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Payment Details"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal account details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAccountUpdate} className="space-y-4">
                  <div>
                    <Label htmlFor="account-name" className="mb-2">
                      Full Name
                    </Label>
                    <Input
                      id="account-name"
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="account-email" className="mb-2">
                      Email
                    </Label>
                    <Input
                      id="account-email"
                      type="email"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Update Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current-password" className="mb-2">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-password" className="mb-2">
                      New Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">Minimum 6 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="mb-2">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
