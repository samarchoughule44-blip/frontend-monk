import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Home,
  UtensilsCrossed,
  Sofa,
  Bed,
  Armchair,
  Wrench,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const Services = () => {
  const [activeTab, setActiveTab] = useState("delivered");
  const [showPopup, setShowPopup] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(4);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [deliveredProjects, setDeliveredProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setDeliveredProjects(data.filter((p) => p.status === "delivered"));
        setUpcomingProjects(data.filter((p) => p.status === "upcoming"));
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const loadMoreProjects = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setVisibleProjects((prev) => prev + 4);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (!loading) loadMoreProjects();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadMoreProjects]);

  useEffect(() => {
    setVisibleProjects(4);
  }, [activeTab]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-primary-foreground py-20">
        <div className="absolute inset-0">
          <img
            src="/assets/Compress-images/livingroom3.jpg"
            className="h-full w-full object-cover"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-primary/80 to-primary/40"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6">
            Where Ideas Become Reality
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto opacity-95 font-dm-sans">
            Comprehensive interior design and renovation solutions tailored to
            your lifestyle and budget
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4">

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-transparent border-b border-gray-200">
              <button
                onClick={() => setActiveTab("delivered")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "delivered"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Delivered Projects
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-6 py-3 font-medium ${
                  activeTab === "upcoming"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Upcoming Projects
              </button>
            </div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(activeTab === "delivered" ? deliveredProjects : upcomingProjects)
              .slice(0, visibleProjects)
              .map((project) => (
                <Card
                  key={project._id}
                  className="overflow-hidden bg-white rounded-xl shadow-xl"
                >
                  <div className="relative h-64">
                    <img
                      src={`${API}${project.imageUrl}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>

                    <p className="text-lg font-medium text-primary mb-2">
                      {project.projectName}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                      <span>{project.style}</span>
                      <span>{project.category}</span>
                      <span>{project.layout}</span>
                      <span>{project.location}</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Pricing:</span>
                        <span>{project.pricing} Lakhs</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="font-medium">BHK:</span>
                        <span>{project.bhk}</span>
                      </div>

                      <Button
                        onClick={() => setShowPopup(true)}
                        className="w-full mb-4"
                      >
                        GET STARTED
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Load More Button */}
          {!loading &&
            visibleProjects <
              (activeTab === "delivered" ? deliveredProjects : upcomingProjects)
                .length && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMoreProjects} variant="outline">
                  Load More Projects
                </Button>
              </div>
            )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Let's Start Your Project</h2>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            Schedule a free consultation to discuss your interior design needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Book Consultation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-background/10 text-primary-foreground border-primary-foreground/20 hover:bg-background/20"
            >
              <Link to="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold mb-4 text-center">Get Started</h3>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);

                try {
                  const response = await fetch(`${API}/api/leads`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: formData.get("name"),
                      email: formData.get("email"),
                      phone: formData.get("phone"),
                      message: formData.get("message") as string,
                      source: "Services Page",
                    }),
                  });

                  if (response.ok) {
                    alert("Request submitted successfully!");
                    setShowPopup(false);
                    (e.target as HTMLFormElement).reset();
                  }
                } catch (error) {
                  alert("Failed to submit request. Please try again.");
                }
              }}
              className="space-y-4"
            >
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <textarea
                name="message"
                placeholder="Project Details"
                rows={3}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />

              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
