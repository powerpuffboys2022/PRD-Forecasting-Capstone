import { useRouter } from "next/router";

const Login = () => {
    const router = useRouter()

    const login = (e) => {
        
        // fetch/login 


        // if login success go to index js
        router.push('/');
        e.preventDefault();
    }

  return (
    <div className="bg-rice-pattern h-screen w-full flex justify-center items-center">
      <div className="flex flex-col justify-center">
        <img
          className="w-4/12 m-auto"
          src="https://cdn.discordapp.com/attachments/955281529481883729/1036886425045577758/prd.png"
        ></img>

        <form>
          <div className="mt-8 form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text font-inter font-medium ">Email</span>
            </label>
            <input
              type="text"
              required
              className="input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 focus:ring-fuchsia-100"
            />
          </div>
          <div className="mt-2 form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text font-inter font-medium">
                Password
              </span>
            </label>
            <input
              type="text"
              required
              className="input input-sm bg-base-200/50 w-full max-w-xs focus:ring-4 focus:ring-fuchsia-100"
            />
          </div>

          <button onClick={(e)=>{login(e)}} className="btn mt-8 btn-sm btn-primary btn-wide " >Login </button>
        </form>
        <p className="mt-5 text-sm">
          Don't have an account?{" "}
          <a className="text-primary" href="/register">
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
