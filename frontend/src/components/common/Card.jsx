const Card = ({
  children
}) => {

  return (

    <div
      className="
      bg-white

      rounded-xl

      shadow-sm

      p-4

      md:p-5

      lg:p-6
      "
    >
      {children}
    </div>

  );

};

export default Card;