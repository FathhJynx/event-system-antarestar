import Layout from "@/components/layout/Layout";
import { useCategories } from "@/hooks/useCategories";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Categories = () => {
    const { data: categories, isLoading } = useCategories();

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 md:py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-display text-4xl md:text-5xl mb-4">Event Categories</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore events by category and find your next challenge.
                    </p>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories?.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/events?category=${category.slug}`}>
                                    <div className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                        <div className="p-8 flex flex-col items-center text-center">
                                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                                <Trophy className="w-8 h-8 text-primary" />
                                            </div>
                                            <h3 className="font-display text-2xl mb-2">{category.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                {category.description || `Browse all ${category.name} events`}
                                            </p>
                                            <div className="flex items-center text-sm font-medium text-primary">
                                                Browse Events <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                        {/* Gradient overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Categories;
