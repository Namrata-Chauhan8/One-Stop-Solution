import { View, Text } from "react-native";
import React from "react";
import Layout from "../components/layouts/Layout";
import Category from "../components/category/Category";
import Banner from "../components/banner/Banner";
import Products from "../components/products/Products";
import Header from "../components/layouts/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <Layout>
      <SafeAreaView>
        <Header />
        <Category />
        <Banner />
        <Products />
      </SafeAreaView>
    </Layout>
  );
};

export default Home;
