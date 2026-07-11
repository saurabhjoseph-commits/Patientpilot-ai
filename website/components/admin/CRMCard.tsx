interface CRMCardProps {
  title: string;
  children: React.ReactNode;
}

export default function CRMCard({
  title,
  children,
}: CRMCardProps) {
  return (
    <div className="rounded-xl bg-white p-8 shadow">
      <h2 className="mb-6 text-xl font-bold">
        {title}
      </h2>

      {children}
    </div>
  );
}