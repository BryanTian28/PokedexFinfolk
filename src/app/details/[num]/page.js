"use client";
import client from "@/apolloClient";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Image, Card, Text, Divider, Tooltip } from "@geist-ui/core";
import Link from "next/link";
import { ChevronsRight, Star } from "@geist-ui/icons";
import { auth, firestore } from "@/firebase";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

const GET_DETAIL_DATA = gql`
	query GetPokemon($number: Int!) {
		getPokemonByDexNumber(number: $number) {
			species
			sprite
			abilities {
				first {
					name
					desc
					shortDesc
				}
				hidden {
					desc
					name
					shortDesc
				}
				second {
					desc
					name
					shortDesc
				}
				special {
					desc
					name
					shortDesc
				}
			}
			gender {
				female
				male
			}
			height
			isEggObtainable
			num
			mythical
			legendary
			baseStats {
				attack
				defense
				hp
				specialattack
				specialdefense
				speed
			}
			baseStatsTotal
			bulbapediaPage
			catchRate {
				base
			}
			evolutions {
				species
				sprite
				num
			}
			preevolutions {
				species
				sprite
				num
			}
			types {
				name
			}
			eggGroups
			evolutionLevel
			levellingRate
			minimumHatchTime
			maximumHatchTime
			smogonTier
			weight
		}
	}
`;
export default function DetailsNum({ params }) {
	const [detail, setDetail] = useState(); //Storing details
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); //Loading Condition

	const collectionRef = collection(firestore, "fav");

	const addDataToFirestore = async () => {
		const user = auth.currentUser;
		if (user) {
			const dataToBeAdded = {
				user: user?.uid,
				num: params.num,
				species: detail.species,
				sprite: detail.sprite,
			};

			try {
				const snapshot = await getDocs(
					query(
						collectionRef,
						where("user", "==", `${user?.uid}`),
						where("num", "==", params.num)
					)
				);

				if (snapshot.size > 0) {
					toast("Pokemon already registered in your favorites");
				} else {
					const docRef = await addDoc(collectionRef, dataToBeAdded);
					toast("Pokemon added to your favorites");
					console.log(docRef);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			toast("Please Log In first before adding pokemons to your favorites");
		}
	};

	const { data } = useQuery(GET_DETAIL_DATA, {
		client,
		variables: { number: parseInt(params.num) },
		onCompleted: (data) => {
			setDetail(data.getPokemonByDexNumber);
			setLoading(false);
		},
		onError: (error) => {
			setError(error);
			setLoading(false);
		},
	});

	useEffect(() => {
		setLoading(true);

		if (data) {
			setDetail(data.getPokemonByDexNumber);
			setLoading(false);
		}
	}, [data]);
	return (
		<div className="min-w-screen min-h-screen bg-[#F2F2F2] flex justify-center">
			<Toaster />
			<div className="max-w-[1600px]">
				<Navbar />
				<div className="flex justify-center text-center min-h-screen">
					{loading ? (
						//Loading UI
						<div className="flex flex-col">
							<Image
								src="https://gifdb.com/images/high/pokemon-funny-anime-pikachu-silly-face-e0gvatulqypwuqui.webp"
								height="400px"
								width="400px"
							/>
							<Text style={{ color: "#0E1F40" }}>
								Please Wait A Moment While We're Fetching The Data..
							</Text>
						</div>
					) : error ? (
						<p>Error: {error.message}</p>
					) : (
						<div className="mt-8">
							{/* Pokemon and the evolutions */}
							<div className="flex flex-row items-center justify-between">
								{/* Preevolution */}
								<div>
									<Card
										width="250px"
										height="250px"
										style={{ backgroundColor: "#0E1F40", marginTop: "32px" }}
									>
										{detail.preevolutions == null ? (
											<Text style={{ color: "#F2F2F2", marginTop: "40%" }}>
												There is no further Pre-Evolution
											</Text>
										) : (
											<Link
												href={`/details/[num]`}
												as={`/details/${detail.preevolutions[0].num}`}
											>
												<Image
													src={detail.preevolutions[0].sprite}
													alt="Image Not Available"
													height="150px"
													style={{ color: "#F2F2F2" }}
												/>
												<Divider type="success" />
												<Text style={{ color: "#F2F2F2" }}>
													{detail.preevolutions[0].species.toUpperCase()}
												</Text>
											</Link>
										)}
									</Card>
								</div>
								<ChevronsRight color="#0E1F40" size="60px" />
								{/* Current */}
								<div className="flex flex-col justify-center">
									<Text
										style={{
											color: "#0E1F40",
											fontSize: "20px",
											fontWeight: "bold",
										}}
									>
										{detail.species.toUpperCase()}
										<Tooltip text="Click to favorite this pokemon">
											<button className="border ml-2" onClick={() => addDataToFirestore()}>
												<Star size={"20px"} />
											</button>
										</Tooltip>
									</Text>
									<a href={detail?.bulbapediaPage}>
										<Text
											style={{
												color: "#0E1F40",

												textDecorationLine: "underline",
											}}
										>
											to Bulbapedia page
										</Text>
									</a>
									<Image
										src={detail.sprite}
										alt="Image Not Found"
										width="300px"
										height="300px"
										style={{
											border: "solid black",
											borderRadius: "md",
										}}
									/>
								</div>
								<ChevronsRight color="#0E1F40" size="60px" />
								{/* Evolution */}
								<div>
									<Card
										width="250px"
										height="250px"
										style={{
											backgroundColor: "#0E1F40",
											marginTop: "32px",
										}}
									>
										{detail.evolutions == null ? (
											<Text style={{ color: "#F2F2F2", marginTop: "40%" }}>
												There is no further Evolution
											</Text>
										) : (
											<Link
												href={`/details/[num]`}
												as={`/details/${detail.evolutions[0].num}`}
											>
												<Image
													src={detail.evolutions[0].sprite}
													alt="Image Not Available"
													height="150px"
													style={{ color: "#F2F2F2" }}
												/>
												<Divider type="success" />
												<Text style={{ color: "#F2F2F2" }}>
													{detail.evolutions[0].species.toUpperCase()}
												</Text>
											</Link>
										)}
									</Card>
								</div>
							</div>
							<div className="mt-4 flex flex-row justify-between">
								{/* Base Stats */}
								<Card style={{ backgroundColor: "#0E1F40" }} width="200px">
									<Text style={{ color: "#F2F2F2" }}>Base Stats</Text>
									<Divider height={1.5} />
									<div className="flex flex-col">
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Attack</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.baseStats?.attack}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Defense</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.baseStats?.defense}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>HP</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail.baseStats?.hp}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Special Attack</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.baseStats?.specialattack}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Special Defense</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.baseStats?.specialdefense}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Speed</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail.baseStats?.speed}</Text>
										</div>
									</div>
								</Card>
								{/* Attributes */}
								<Card style={{ backgroundColor: "#0E1F40" }} width="300px">
									<Text style={{ color: "#F2F2F2" }}>Attributes</Text>
									<Divider height={1.5} />
									<div className="flex flex-col">
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Species</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.species}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Gender (M:F)</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail?.gender.male}:{detail?.gender.female}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Height</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.height} m</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Weight</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.weight} kg</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Base Stats Total</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.baseStatsTotal}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Is Egg Obtainable</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail?.isEggObtainable ? "Yes" : "No"}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Base Catch Rate</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail.catchRate?.base}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Mythical</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail?.mythical ? "Yes" : " No"}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Legendary</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail?.legendary ? "Yes" : " No"}
											</Text>
										</div>
									</div>
								</Card>
								{/* Information */}
								<Card style={{ backgroundColor: "#0E1F40" }} width="400px">
									<Text style={{ color: "#F2F2F2" }}>Information</Text>
									<Divider height={1.5} />
									<div className="flex flex-col">
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Egg group</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.eggGroups?.join(", ")}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Types</Text>
											<Text style={{ color: "#F2F2F2" }}>
												:{" "}
												{detail.types?.map((value) => {
													return value.name + " ";
												})}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Levelling Rate</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.levellingRate}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Evolution Level:</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail?.evolutionLevel ? detail?.evolutionLevel : "None"}
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Min Hatch Time</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.minimumHatchTime} Steps
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Max Hatch Time</Text>
											<Text style={{ color: "#F2F2F2" }}>
												: {detail.maximumHatchTime} Steps
											</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Smogon Tier</Text>
											<Text style={{ color: "#F2F2F2" }}>: {detail?.smogonTier}</Text>
										</div>
										<div className="flex justify-between">
											<Text style={{ color: "#F2F2F2" }}>Pokedex Number</Text>
											<Text style={{ color: "#F2F2F2" }}>: {params.num}</Text>
										</div>
									</div>
								</Card>
							</div>
							{/* Abilities */}
							<div className="mt-4 mb-4">
								<Card style={{ backgroundColor: "#0E1F40" }}>
									<Text style={{ color: "#F2F2F2" }}>Abilities</Text>
									<Divider height={1.5} />
									<Text style={{ color: "#F2F2F2" }}>
										First: {detail.abilities.first?.name}
									</Text>
									<Text style={{ color: "#F2F2F2" }}>
										{detail.abilities.first?.shortDesc}
									</Text>
									<Divider />
									<Text style={{ color: "#F2F2F2" }}>
										Second: {detail.abilities.second?.name}
									</Text>
									<Text style={{ color: "#F2F2F2" }}>
										{detail.abilities.second?.shortDesc}
									</Text>
									<Divider />
									<Text style={{ color: "#F2F2F2" }}>
										Special: {detail.abilities.special?.name}
									</Text>
									<Text style={{ color: "#F2F2F2" }}>
										{detail.abilities.special?.shortDesc}
									</Text>
									<Divider />
									<Text style={{ color: "#F2F2F2" }}>
										Hidden: {detail.abilities.hidden?.name}
									</Text>
									<Text style={{ color: "#F2F2F2" }}>
										{detail.abilities.hidden?.shortDesc}
									</Text>
								</Card>
							</div>
						</div>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
