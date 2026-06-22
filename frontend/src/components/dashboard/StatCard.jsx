const StatCard = ({ title, value }) => {
  return (
    <>
    <div
      className="
      bg-white

      rounded-xl

      shadow-sm

      p-4
      "
    >
      <p
        className="
        text-gray-500
        "
      >
        {title}
      </p>

      <h2
        className="
        text-2xl

        font-bold

        mt-2
        "
      >
        {value}
      </h2>
    </div>
  );

  <StatCard
 title="Total"
 value="12"
/>

<StatCard
 title="Pending"
 value="4"
/>

<StatCard
 title="In Progress"
 value="3"
/>

<StatCard
 title="Resolved"
 value="5"
/>
</>
)}; 

export default StatCard;
