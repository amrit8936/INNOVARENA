// EmptyState – shown when a list has no items
// Props: icon (emoji string), title, subtitle
const EmptyState = ({ icon = "📭", title = "Nothing here yet", subtitle = "" }) => {
  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-500">{title}</h3>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
};

export default EmptyState;
