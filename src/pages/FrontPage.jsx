import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowRight, ShoppingBag, Clock, Star } from "lucide-react";
import heroImage from "../assets/hero-food.jpg";
import { UserPlus } from "lucide-react";

const FrontPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Delicious food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Delicious Food,
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Order from your favorite restaurants and get fresh, hot meals
              delivered right to your doorstep. Browse our menu of pizzas,
              burgers, drinks, and desserts!
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/menu/pizza">
                <Button size="lg" className="btn-hero group">
                  Start Ordering
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth/role">
                <Button
                  size="lg"
                  className="rounded-full px-6 py-4 bg-white/15 text-white border border-white/40 backdrop-blur-md
               hover:bg-white/25 hover:border-white/60 hover:scale-[1.04] transition-all duration-300 
               font-semibold flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-slide-up">
                <div className="bg-primary/20 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Easy Ordering</h3>
                  <p className="text-sm text-white/70">Simple & quick</p>
                </div>
              </div>

              <div
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="bg-secondary/20 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Fast Delivery</h3>
                  <p className="text-sm text-white/70">30 min or less</p>
                </div>
              </div>

              <div
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="bg-accent/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Top Rated</h3>
                  <p className="text-sm text-white/70">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FoodHub
              </span>
              ?
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              We partner with the best restaurants to bring you a wide variety
              of cuisines. From classic pizzas to gourmet burgers, refreshing
              drinks to delightful desserts — we've got something for every
              craving!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {["🍕 Pizza", "🍔 Burgers", "🥤 Drinks", "🍰 Desserts"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-5xl mb-4">{item.split(" ")[0]}</div>
                    <h3 className="text-xl font-semibold">
                      {item.split(" ")[1]}
                    </h3>
                  </div>
                )
              )}
            </div>

            <div className="mt-12">
              <Link to="/menu/pizza">
                <Button size="lg" className="btn-hero">
                  Explore Menu
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;
