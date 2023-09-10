"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth, firestore } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	collection,
	deleteDoc,
	getDocs,
	where,
	query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, Text, Divider, Image } from "@geist-ui/core";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function FavPage() {
	const [favs, setFavs] = useState();
	const [user, loading, error] = useAuthState(auth); //firebase hook to listen for state change in logged in user
	const [skeleton, setSkeleton] = useState([1, 1, 1, 1, 1]);

	const getFavoritesData = async (uid) => {
		try {
			const collectionRef = collection(firestore, "fav");
			const q = query(collectionRef, where("user", "==", uid));
			const querySnapshot = await getDocs(q);

			// Process and return the fetched data
			const userData = querySnapshot.docs.map((doc) => doc.data());
			return userData;
		} catch (error) {
			throw error;
		}
	};

	const removeFavorite = async (num) => {
		try {
			const collectionRef = collection(firestore, "fav");
			const q = query(
				collectionRef,
				where("user", "==", user?.uid),
				where("num", "==", num)
			);

			const snapshot = await getDocs(q);
			const toDelete = snapshot.docs[0];
			await deleteDoc(toDelete.ref);
			toast("Pokemon removed from favorites");
			getFavoritesData(user.uid)
				.then((userData) => {
					setFavs(userData);
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (user) {
			// Fetch data when there is a user logged in
			getFavoritesData(user.uid)
				.then((userData) => {
					setFavs(userData);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [user]);

	return (
		<div className="min-w-screen min-h-screen bg-[#F2F2F2] flex justify-center">
			<Toaster />
			<div className="max-w-[1600px]">
				<Navbar />
				<div className="min-h-screen flex flex-col text-center">
					<h1 className="text-3xl text-[#0E1F40] font-extrabold mt-4">
						Your Favorite Pokemons
					</h1>
					<div className="flex flex-wrap justify-center text-center mt-4">
						{loading ? (
							// WHILE DATA IS LOADING
							<>
								{/* Skeleton Rendering */}
								{skeleton.map((value, index) => {
									return (
										<div className="xs:w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 mt-4 mb-4 ml-0 mr-0 flex justify-center">
											<Link href={"/"}>
												<Card
													width="250px"
													height="250px"
													style={{ backgroundColor: "#0E1F40" }}
													key={index}
												>
													<Text style={{ color: "#F2F2F2" }}>Loading...</Text>
												</Card>
											</Link>
										</div>
									);
								})}
							</>
						) : error ? (
							<p>Error: {error.message}</p>
						) : (
							// WHEN DATA IS AVAILABLE
							<>
								{favs?.map((value) => {
									return (
										<div className="xs:w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 mt-4 mb-4 ml-0 mr-0 flex justify-center">
											{/* Render those with details page */}

											<Card
												width="250px"
												height="250px"
												style={{ backgroundColor: "#0E1F40" }}
											>
												<Link href={`/details/[num]`} as={`/details/${value.num}`}>
													<Image
														src={value.sprite}
														alt="Image Not Available"
														height="150px"
														style={{ color: "#F2F2F2" }}
													/>
												</Link>
												<Divider type="success" />
												<Text style={{ color: "#F2F2F2" }}>
													{value.species.toUpperCase()}
												</Text>
												<button
													className="bg-red-400 border border-white px-2 rounded-md mt-2"
													onClick={() => removeFavorite(value.num)}
												>
													Remove
												</button>
											</Card>
										</div>
									);
								})}
							</>
						)}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
