import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
  return (
    <div className="w-full">
      <OrganizationProfile routing="hash" />
    </div>
  );
};

export default SettingsPage;
