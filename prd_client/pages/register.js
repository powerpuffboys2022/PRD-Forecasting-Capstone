import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();

  const register = () => {
    // TODO
    // insert & acquire cookie/session token

    // if register success then go to index
    router.push("/");
  };

  return (
    <div className="bg-rice-pattern h-screen w-full flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <img
          className="w-4/12 m-auto"
          src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
        ></img>

        <div className="mt-8 form-control w-full max-w-xs">
          <label className="label">
            <span className="text-sm font-inter font-medium ">Email</span>
          </label>
          <input
            type="text"
            className="input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 focus:ring-fuchsia-100"
          />
        </div>
        <div className="mt-2 form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-inter font-medium ">
              User Name
            </span>
          </label>
          <input
            type="text"
            className="input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 focus:ring-fuchsia-100"
          />
        </div>
        <div className="mt-2 form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-inter font-medium">Password</span>
          </label>
          <input
            type="text"
            className="input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 focus:ring-fuchsia-100"
          />
        </div>

        <button
          onClick={() => register()}
          className="btn mt-8 btn-sm btn-primary btn-wide "
        >
          Register
        </button>
        <p className="mt-5 text-sm">
          Already have an account?{" "}
          <a className="text-primary" href="/login">
            Login instead.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
