const Button = ({
  children,
  loading,
  ...props
}) => {

  return (

    <button

      {...props}

      disabled={loading}

      className="
      w-full

      h-12

      bg-blue-600

      text-white

      rounded-lg

      font-medium

      disabled:opacity-50
      "

    >

      {
        loading
        ? "Loading..."
        : children
      }

    </button>

  );

};

export default Button;