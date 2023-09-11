// components/Navbar.js
"use client";
import Link from "next/link";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initFirebase } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Tooltip } from "@geist-ui/core";
import { collection, getDocs, where, query } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useEffect, useState } from "react";
const Navbar = () => {
	const [size, setSize] = useState(0);
	//Firebase Google setup
	const auth = getAuth();
	const [user, loading] = useAuthState(auth);
	initFirebase();
	const provider = new GoogleAuthProvider();

	const signInWithGoogle = async () => {
		await signInWithPopup(auth, provider);
	};

	const getCollectionSize = async () => {
		try {
			if (user) {
				const collectionRef = collection(firestore, "fav");
				const q = query(collectionRef, where("user", "==", user?.uid));
				const querySnapshot = await getDocs(q);
				setSize(querySnapshot.size);
			}
		} catch (error) {
			throw error;
		}
	};

	useEffect(() => {
		getCollectionSize();
	}, [user]);

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
							<li className="mx-4 flex justify-center items-center border px-2 rounded-md">
								<Link href={"/favorites"}>My Favorites ({size})</Link>
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
