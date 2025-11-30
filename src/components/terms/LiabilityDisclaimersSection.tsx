import React from "react";

export default function LiabilityDisclaimersSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Liability and Disclaimers</h2>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">5.1 Platform Disclaimer</h3>
      <p className="text-gray-700 mb-4">
        Pet Realm acts as a marketplace platform connecting buyers and sellers. We do not directly sell products or provide veterinary services. While
        we vet our partners, we cannot guarantee the quality of all products or services listed.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">5.2 Limitation of Liability</h3>
      <p className="text-gray-700 mb-4">
        To the maximum extent permitted by Maldivian law, Pet Realm&apos;s liability for any damages arising from your use of our Service is limited
        to the amount you paid us in the 12 months preceding the claim.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mb-3">5.3 Emergency Situations</h3>
      <p className="text-gray-700 mb-4">
        Pet Realm is not responsible for providing emergency veterinary care. In case of pet emergencies, contact local emergency veterinary services
        immediately.
      </p>
    </section>
  );
}
