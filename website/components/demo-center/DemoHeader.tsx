import PageHeader from "@/components/ui/dashboard/PageHeader";

export default function DemoHeader() {
  return (
    <PageHeader
      title="Demo Center"
      subtitle="Create personalized AI demonstrations for every dental practice. Configure clinic details, launch presentations, and monitor demo performance."
      actions={
        <button
          className="
            rounded-xl
            bg-blue-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          + New Demo
        </button>
      }
    />
  );
}