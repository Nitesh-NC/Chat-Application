import logo from "../assets/logo.jpg";

const AuthLayout = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-2 shadow-sm bg-white">
        <img src={logo} alt="logo" width={180} height={60} />
      </header>
      {children}
    </>
  );
};

export default AuthLayout;
