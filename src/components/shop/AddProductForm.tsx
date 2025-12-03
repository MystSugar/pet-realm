"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, X, Loader2, Upload } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const PRODUCT_CATEGORIES = [
  { value: "CATS", label: "Live Cats" },
  { value: "BIRDS", label: "Live Birds" },
  { value: "FISH", label: "Live Fish" },
  { value: "REPTILES", label: "Live Reptiles" },
  { value: "SMALL_PETS", label: "Live Small Pets" },
  { value: "PET_FOOD", label: "Pet Food" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "TOYS", label: "Toys" },
  { value: "HEALTH_CARE", label: "Health Care" },
];

const LIVE_ANIMAL_CATEGORIES = ["CATS", "BIRDS", "FISH", "REPTILES", "SMALL_PETS"];

const productFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  lowStockThreshold: z.number().int().min(1, "Low stock threshold must be at least 1"),
  category: z.string().min(1, "Please select a category"),
  images: z.array(z.string()),
  tags: z.string(),
  available: z.boolean(),
  // Animal-specific fields
  breed: z.string().optional(),
  age: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "UNKNOWN"]).optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
  vaccinationStatus: z.string().optional(),
  healthCertificate: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function AddProductForm() {
  const { status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLiveAnimal, setIsLiveAnimal] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      lowStockThreshold: 5,
      category: "",
      images: [],
      tags: "",
      available: true,
      breed: "",
      age: "",
      gender: undefined,
      weight: "",
      color: "",
      vaccinationStatus: "",
      healthCertificate: "",
    },
  });

  const selectedCategory = form.watch("category");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    setIsLiveAnimal(LIVE_ANIMAL_CATEGORIES.includes(selectedCategory));
  }, [selectedCategory]);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/shop/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await response.json();
      const newUrls = [...imageUrls, data.url];
      setImageUrls(newUrls);
      form.setValue("images", newUrls);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB");
        return;
      }
      handleImageUpload(file);
    }
    // Reset input
    e.target.value = "";
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    form.setValue("images", newUrls);
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        category: data.category,
        images: imageUrls,
        tags: tagsArray,
        available: data.available,
        ...(isLiveAnimal && {
          breed: data.breed || null,
          age: data.age || null,
          gender: data.gender || null,
          weight: data.weight || null,
          color: data.color || null,
          vaccinationStatus: data.vaccinationStatus || null,
          healthCertificate: data.healthCertificate || null,
        }),
      };

      const response = await fetch("/api/shop/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      router.push("/shop/products");
      router.refresh();
    } catch {
      // Error handled
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <LoadingState message="Loading form..." />;
  }

  return (
    <div className="bg-cream-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/shop/products">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to add a new product to your shop</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Premium Cat Food" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed product description..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing & Inventory */}
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Pricing & Inventory</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (MVR) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value === "" ? 0 : parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? 5 : parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>You&apos;ll be notified when stock falls below this level</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Product Available</FormLabel>
                        <FormDescription>Mark as available for customers to purchase</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Product Images</h2>

                <div>
                  <Input
                    id="product-image-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("product-image-upload")?.click()}
                    disabled={uploadingImage}>
                    {uploadingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">Upload product images (JPG or PNG, max 5MB each)</p>
                </div>

                {imageUrls.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {imageUrls.length} image{imageUrls.length !== 1 ? "s" : ""} uploaded
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative space-y-2">
                          <div className="aspect-square border rounded-lg overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs sm:text-sm"
                              onClick={() => {
                                removeImageUrl(index);
                                document.getElementById("product-image-upload")?.click();
                              }}
                              title="Replace image">
                              <Upload className="h-3 w-3 mr-1" />
                              <span className="hidden sm:inline">Replace</span>
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="px-2 sm:px-3"
                              onClick={() => removeImageUrl(index)}
                              title="Remove image">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Tags</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., organic, premium, bestseller (comma-separated)" {...field} />
                      </FormControl>
                      <FormDescription>Separate tags with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Animal-Specific Fields */}
            {isLiveAnimal && (
              <Card>
                <CardContent className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Animal Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breed</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Persian, Siamese" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 6 months, 2 years" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MALE">Male</SelectItem>
                              <SelectItem value="FEMALE">Female</SelectItem>
                              <SelectItem value="UNKNOWN">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2.5 kg" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Orange, White" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vaccinationStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vaccination Status</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Fully vaccinated" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="healthCertificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Certificate URL</FormLabel>
                        <FormControl>
                          <Input placeholder="URL to health certificate document" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/shop/products")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
