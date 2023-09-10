"use client";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";
import React, { useState, useEffect } from "react";
import client from "@/apolloClient";
import {
	Card,
	Image,
	Text,
	Divider,
	Pagination,
	ButtonDropdown,
} from "@geist-ui/core";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const GET_ALL_DATA = gql`
	query GetPokemon {
		getAllPokemon {
			species
		}
	}
`;
const GET_HOME_DATA = gql`
	query GetPokemon($offset: Int, $take: Int!) {
		getAllPokemon(offset: $offset, take: $take) {
			key
			num
			species
			sprite
		}
	}
`;

export default function Home() {
	const [pokemons, setPokemons] = useState([]); //Storing data
	const [page, setPage] = useState(1); //Page number
	const [perPage, setPerPage] = useState(10); //Amount per page
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); //To show loading interface
	const [skeleton, setSkeleton] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]); //For Loading Interface
	const [limiter, setLimiter] = useState(); //Limiter for Pokemons

	let offset = (page - 1) * perPage <= 1389 ? (page - 1) * perPage : 1389; //1389 From GraphQL Database
	let take = offset + perPage > limiter ? limiter - offset : perPage; //For the last page where the data might be less than perPage

	const handlePageChange = (newPage) => {
		setPage(newPage);
	};

	const handlePerPageChange = (newAmount) => {
		setPerPage(newAmount);
		//For Changing the amount of cards loading
		let newArr = [];
		for (let i = 0; i < newAmount; i++) {
			newArr.push(1);
		}
		setSkeleton(newArr);
	};

	const { pageData } = useQuery(GET_ALL_DATA, {
		client,
		onCompleted: (data) => {
			setLimiter(data?.getAllPokemon.length);
		},
		onError: (error) => {
			setError(error);
		},
	});

	const { data } = useQuery(GET_HOME_DATA, {
		client,
		variables: { offset, take },
		onCompleted: (data) => {
			setPokemons(data.getAllPokemon);
			setLoading(false);
		},
		onError: (error) => {
			setError(error);
			setLoading(false);
		},
	});

	//To set the amount of data at the start
	useEffect(() => {
		if (pageData) {
			setLimiter(pageData.getAllPokemon?.length);
		}
	}, []);

	useEffect(() => {
		setLoading(true);

		if (data) {
			setPokemons(data.getAllPokemon);
			setLoading(false);
		}
	}, [data, page, perPage, limiter]);

	return (
		<div className="min-w-screen min-h-screen bg-[#F2F2F2] flex justify-center">
			<Toaster />
			<div className="max-w-[1600px]">
				<Navbar />
				<div className="flex flex-wrap justify-center text-center min-h-screen">
					{loading ? (
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
							<div className="w-full flex justify-center mt-4">
								{/* To choose page */}
								<Pagination
									count={Math.ceil(limiter / perPage)}
									initialPage={page}
									limit={10}
									onChange={handlePageChange}
								/>
							</div>
							<div className="w-full flex justify-center mb-48 mt-4">
								{/* To Choose the amount of cards per page */}
								<ButtonDropdown>
									<ButtonDropdown.Item main>Pokemons per page</ButtonDropdown.Item>
									<ButtonDropdown.Item onClick={() => handlePerPageChange(10)}>
										10(default)
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
							</div>
						</>
					) : error ? (
						<p>Error: {error.message}</p>
					) : (
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
							<div className="w-full flex justify-center mt-4">
								{/* To choose page */}
								<Pagination
									count={Math.ceil(limiter / perPage)}
									initialPage={page}
									limit={10}
									onChange={handlePageChange}
								/>
							</div>
							<div className="w-full flex justify-center mb-48 mt-4">
								{/* To Choose the amount of cards per page */}
								<ButtonDropdown>
									<ButtonDropdown.Item main>Pokemons per page</ButtonDropdown.Item>
									<ButtonDropdown.Item onClick={() => handlePerPageChange(10)}>
										10(default)
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
							</div>
						</>
					)}
				</div>
				<Footer />
			</div>
		</div>
	);
}
