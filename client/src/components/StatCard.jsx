// StatCard – displays a single dashboard stat (number + label)
// Props: icon (emoji), label (string), value (number or string), color (Tailwind bg class)
const StatCard = ({ icon, label, value, color = "bg-indigo-50" }) => {
  return (
    <div className={`${color} rounded-xl p-5 flex items-center gap-4 shadow-sm`}>
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
