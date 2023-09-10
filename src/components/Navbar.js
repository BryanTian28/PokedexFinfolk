// components/Navbar.js
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initFirebase } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Tooltip } from "@geist-ui/core";
const Navbar = () => {
	//Firebase Google setup
	const auth = getAuth();
	const [user, loading] = useAuthState(auth);
	initFirebase();
	const provider = new GoogleAuthProvider();

	const signInWithGoogle = async () => {
		await signInWithPopup(auth, provider);
	};

	return (
		<nav className="bg-[#0E1F40] h-20 flex align-middle items-center justify-between min-w-[1600px]">
			<div>
				<ul className="flex flex-row">
					<li className="mx-4">
						<Link href="/">Home</Link>
					</li>
					<li className="mx-4">
						<Link href="/search">Search By Name</Link>
					</li>
					<li className="mx-4">
						<Link href="/search">Search By Number</Link>
					</li>
				</ul>
			</div>
			<div className="mr-2">
				<ul className="flex flex-row">
					{user ? (
						<>
							<li className="flex align-middle justify-center items-center">
								<p>Hello, {user.displayName}</p>
							</li>
							<li className="mx-4">
								<Link>My Favorites</Link>
							</li>
							<li className="mx-3 border px-4 py-3 rounded-lg">
								<button onClick={() => auth.signOut()}>Sign out</button>
							</li>
						</>
					) : (
						<Tooltip
							text={"Sign in to save your favorite pokemons"}
							placement="bottom"
						>
							<li className="mx-3 border px-4 py-3 rounded-lg">
								<button onClick={() => signInWithGoogle()}>Sign In Using Google</button>
							</li>
						</Tooltip>
					)}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
