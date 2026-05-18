// import { type ChangeEvent, type SyntheticEvent, useState } from "react";
// import { useNavigate } from "react-router";
// import type { LoginState } from "../../types/Auth";

// export default function Login() {
//     const navigate = useNavigate();
//     const [error, setError] = useState("");
//     const [form, setForm] = useState<LoginState>({
//         username: "",
//         password: ""
//     })
    
//     const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
//         e.preventDefault();
        
//         console.log(form)
        
//         // if(result.success) {
//         //     navigate("/")
//         // } else {
//         //     setError("Login failed")
//         // }
//     }

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target
//         setForm(prev => ({...prev, [name]:value}))
//     }

//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <label>Username <input 
//                     name="username"
//                     value={form.username}
//                     onChange={handleChange}
//                     /></label>

//                 <label>Password <input 
//                     name="password"
//                     value={form.password}
//                     onChange={handleChange}
//                 /></label>
//                 <button type="submit">Login</button>
//             </form>
//             {error && <p>{error}</p>}
//         </div>
//     )
// }

export default function Login() {

    return <h1>Login page</h1>
}