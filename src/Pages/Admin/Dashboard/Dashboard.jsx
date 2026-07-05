import Card from "@/Pages/Admin/Components/Card";
import Heading from "@/Pages/Admin/Components/Heading";

const barData = [
  { label: "S1", value: 32 },
  { label: "S2", value: 27 },
  { label: "S3", value: 18 },
  { label: "S4", value: 24 },
];

const lineData = [
  { label: "Jan", value: 8 },
  { label: "Feb", value: 12 },
  { label: "Mar", value: 10 },
  { label: "Apr", value: 16 },
  { label: "Mei", value: 20 },
  { label: "Jun", value: 24 },
];

const donutData = [
  { label: "Aktif", value: 68, color: "#2563eb" },
  { label: "Baru", value: 22, color: "#10b981" },
  { label: "Nonaktif", value: 10, color: "#f59e0b" },
];

const maxBarValue = Math.max(...barData.map((item) => item.value));
const linePoints = lineData
  .map((item, index) => {
    const x = 30 + index * 50;
    const y = 140 - item.value * 4;
    return `${x},${y}`;
  })
  .join(" ");

const totalDonut = donutData.reduce((sum, item) => sum + item.value, 0);
let cumulative = 0;
const donutSegments = donutData.map((item) => {
  const start = cumulative;
  cumulative += item.value;
  const end = cumulative;
  const startAngle = (start / totalDonut) * 360;
  const endAngle = (end / totalDonut) * 360;
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  const radius = 50;
  const center = 60;
  const startX = center + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
  const startY = center + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
  const endX = center + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
  const endY = center + radius * Math.sin((endAngle - 90) * (Math.PI / 180));

  return {
    ...item,
    d: `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
  };
});

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Heading as="h2" className="mb-2 text-left">
          Dashboard Ringkasan
        </Heading>
        <p className="text-slate-600">
          Visualisasi singkat data mahasiswa untuk memudahkan pemantauan.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Mahasiswa</p>
              <p className="text-3xl font-semibold">321</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">🎓</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Aktif Bulan Ini</p>
              <p className="text-3xl font-semibold">48</p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">📈</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Kehadiran Rata-rata</p>
              <p className="text-3xl font-semibold">92%</p>
            </div>
            <div className="rounded-full bg-amber-100 p-3 text-amber-600">✅</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <Heading as="h3" className="mb-4 text-left text-lg">
            Mahasiswa per Semester
          </Heading>
          <div className="flex h-56 items-end justify-between gap-3">
            {barData.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center">
                <div className="flex h-44 w-full items-end justify-center rounded-t-xl bg-slate-100 p-1">
                  <div
                    className="w-full rounded-t-xl bg-blue-500"
                    style={{ height: `${(item.value / maxBarValue) * 100}%` }}
                  />
                </div>
                <span className="mt-2 text-sm text-slate-600">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Heading as="h3" className="mb-4 text-left text-lg">
            Pertumbuhan Mahasiswa
          </Heading>
          <svg viewBox="0 0 300 160" className="h-56 w-full">
            <line x1="20" y1="140" x2="280" y2="140" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="20" y1="100" x2="280" y2="100" stroke="#e2e8f0" strokeWidth="1" />
            <line x1="20" y1="60" x2="280" y2="60" stroke="#e2e8f0" strokeWidth="1" />
            <polyline
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              points={linePoints}
            />
            {lineData.map((item, index) => {
              const x = 30 + index * 50;
              const y = 140 - item.value * 4;
              return <circle key={item.label} cx={x} cy={y} r="4" fill="#2563eb" />;
            })}
          </svg>
          <div className="mt-2 flex justify-between text-sm text-slate-500">
            {lineData.map((item) => (
              <span key={item.label}>{item.label}</span>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Heading as="h3" className="mb-4 text-left text-lg">
          Distribusi Status Mahasiswa
        </Heading>
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <svg viewBox="0 0 120 120" className="h-40 w-40">
            {donutSegments.map((segment) => (
              <path key={segment.label} d={segment.d} fill={segment.color} />
            ))}
            <circle cx="60" cy="60" r="28" fill="white" />
          </svg>
          <div className="flex-1 space-y-3">
            {donutData.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.label}</span>
                </div>
                <span className="font-semibold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;