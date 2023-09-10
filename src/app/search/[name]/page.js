"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from "@geist-ui/icons";
import { useState } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import client from "@/apolloClient";
import { Card, Image, Text, Divider, ButtonDropdown } from "@geist-ui/core";
import toast, { Toaster } from "react-hot-toast";

const GET_BY_SEARCH = gql`
	query GetPokemon($pokemon: String!, $take: Int) {
		getFuzzyPokemon(pokemon: $pokemon, take: $take) {
			num
			species
			sprite
		}
	}
`;
export default function SearchName({ params }) {
	const [pokemons, setPokemons] = useState([]);
	const [toSearch, setToSearch] = useState("");
	const [take, setTake] = useState(10); //Amount wanted
	const [loading, setLoading] = useState(true); //To show loading interface
	const [error, setError] = useState(null);
	const [skeleton, setSkeleton] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); //For Loading Interface
	console.log(params.name);

	const { data } = useQuery(GET_BY_SEARCH, {
		client,
		variables: { pokemon: params.name, take },
		onCompleted: (data) => {
			setPokemons(data?.getFuzzyPokemon);
			setLoading(false);
		},
		onError: (error) => {
			setError(error);
		},
	});

	const handlePerPageChange = (newAmount) => {
		setTake(newAmount);
		//For Changing the amount of cards loading
		let newArr = [];
		for (let i = 0; i < newAmount; i++) {
			newArr.push(1);
		}
		setSkeleton(newArr);
	};
	return (
		<div className="min-w-screen min-h-screen bg-[#F2F2F2] flex justify-center">
			<Toaster />
			<div className="max-w-[1600px]">
				<Navbar />
				<div className="min-h-screen flex flex-col justify-center items-center">
					<div className="bg-[#0E1F40] w-[300px] h-[60px] flex align-middle items-center rounded-lg mt-8">
						<input
							className="h-[30px] ml-2 text-[#0E1F40] border rounded-md pl-2"
							placeholder="Input Pokemon Name"
							onChange={(event) => setToSearch(event.target.value)}
						/>
						<Link href={`/search/[name]`} as={`/search/${toSearch}`}>
							<Search className="ml-4" />
						</Link>
					</div>
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
								<div className="w-full flex justify-center mb-48 mt-4">
									{/* To Choose the amount of cards per page */}
									<Text style={{ color: "#0E1F40" }} marginRight={"4px"}>
										This page will show
									</Text>
									<ButtonDropdown width={"10px"} placeholder="10">
										<ButtonDropdown.Item onClick={() => handlePerPageChange(10)}>
											10
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(15)}>
											15
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(20)}>
											20
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(30)}>
											30
										</ButtonDropdown.Item>
									</ButtonDropdown>
									<Text style={{ color: "#0E1F40" }} marginLeft={"4px"}>
										Pokemons with the closest names
									</Text>
								</div>
							</>
						) : error ? (
							<p>Error: {error.message}</p>
						) : (
							// WHEN DATA IS AVAILABLE
							<>
								{pokemons?.map((value) => {
									return (
										<div className="xs:w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 mt-4 mb-4 ml-0 mr-0 flex justify-center">
											{/* Render those with details page */}
											{value.num >= -68 && value.num <= 905 ? (
												<Link href={`/details/[num]`} as={`/details/${value.num}`}>
													<Card
														width="250px"
														height="250px"
														style={{ backgroundColor: "#0E1F40" }}
													>
														<Image
															src={value.sprite}
															alt="Image Not Available"
															height="150px"
															style={{ color: "#F2F2F2" }}
														/>
														<Divider type="success" />
														<Text style={{ color: "#F2F2F2" }}>
															{value.species.toUpperCase()}
														</Text>
													</Card>
												</Link>
											) : (
												// Those without details page
												<Card
													width="250px"
													height="250px"
													style={{ backgroundColor: "#0E1F40" }}
													onClick={() => toast(`${value?.species} doesn't have detail page`)}
												>
													<Image
														src={value.sprite}
														alt="Image Not Available"
														height="150px"
														style={{ color: "#F2F2F2" }}
													/>
													<Divider type="success" />
													<Text style={{ color: "#F2F2F2" }}>
														{value.species.toUpperCase()}
													</Text>
												</Card>
											)}
										</div>
									);
								})}

								<div className="w-full flex justify-center mb-48 mt-4 items-center">
									{/* To Choose the amount of cards per page */}
									<Text style={{ color: "#0E1F40" }} marginRight={"4px"}>
										This page will show{" "}
									</Text>
									<ButtonDropdown width={"10px"} placeholder="10">
										<ButtonDropdown.Item onClick={() => handlePerPageChange(10)}>
											10
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(15)}>
											15
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(20)}>
											20
										</ButtonDropdown.Item>
										<ButtonDropdown.Item onClick={() => handlePerPageChange(30)}>
											30
										</ButtonDropdown.Item>
									</ButtonDropdown>
									<Text style={{ color: "#0E1F40" }} marginLeft={"4px"}>
										Pokemons with the closest names
									</Text>
								</div>
							</>
						)}
					</div>
				</div>
				<Footer />
			</div>
		</div>
	);
}
