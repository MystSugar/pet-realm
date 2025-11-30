import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, Clock, Users } from "lucide-react";

export default function ContactContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
          </div>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto">Have a question or need help? We&apos;re here for you!</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 mb-12">
          {/* Email */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow m-6">
            <CardContent className="px-8 py-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-800">Email</h3>
                  <a href="mailto:support@petrealm.mv" className="text-primary-600 hover:text-primary-700 text-lg">
                    support@petrealm.mv
                  </a>
                  <p className="text-sm text-gray-600">We&apos;ll respond within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow m-6">
            <CardContent className="px-8 py-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent-100 rounded-lg">
                  <Phone className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-800">Phone</h3>
                  <a href="tel:+9607123456" className="text-accent-600 hover:text-accent-700 text-lg">
                    +960 712-3456
                  </a>
                  <p className="text-sm text-gray-600">Available during business hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow m-6">
            <CardContent className="px-8 py-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-800">Location</h3>
                  <p className="text-gray-700 text-lg">Male&apos;, Maldives</p>
                  <p className="text-sm text-gray-600">Serving the greater Male&apos; area</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow m-6">
            <CardContent className="px-8 py-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-800">Business Hours</h3>
                  <div className="space-y-1 text-gray-700">
                    <p>Saturday - Thursday: 9:00 AM - 11:00 PM</p>
                    <p className="text-sm text-gray-600">Closed on Fridays</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="shadow-lg max-w-6xl mx-auto mx-6">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-charcoal-800 mb-2">Get in Touch</h3>
                <p className="text-gray-600 mb-2">
                  Pet Realm is your trusted marketplace for pet products and services in the Maldives. Whether you&apos;re looking for pet supplies,
                  connecting with local shops, or have questions about our platform, we&apos;re here to help.
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>• For shop owners: Learn about listing your business on our platform</p>
                  <p>• For customers: Get help with orders, products, or general inquiries</p>
                  <p>• For partnerships: Discuss collaboration opportunities</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
