import ConstructionMessage from "@/components/ConstructionMessage";
import ProjectCard from "@/components/ProjectCard";
import ProjectGrid from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/projects";
import { FiFilter } from "react-icons/fi";

export default function Portfolio() {
  const projects = getAllProjects();

  return (
    <ProjectGrid projects={ projects }/>
  )

}