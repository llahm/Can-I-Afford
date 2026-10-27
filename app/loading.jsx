import CustomLoader from "@/components/CustomLoader";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <CustomLoader text="Preparing your sanctuary..." />
    </div>
  );
}
