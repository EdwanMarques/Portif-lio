import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Server, BarChart, BrainCircuit, Bot, Network } from "lucide-react";

interface Skill {
  name: string;
}

const frontendSkills: Skill[] = [
  { name: "React" },
  { name: "Vue.js" },
  { name: "Angular" },
  { name: "Next.js" },
  { name: "TailwindCSS" },
  { name: "SCSS" },
  { name: "TypeScript" },
  { name: "JavaScript" }
];

const backendSkills: Skill[] = [
  { name: "Node.js" },
  { name: "Express" },
  { name: "Python" },
  { name: "Django" },
  { name: "FastAPI" },
  { name: "PHP" },
  { name: "Laravel" },
  { name: "GraphQL" }
];

const devopsSkills: Skill[] = [
  { name: "MongoDB" },
  { name: "PostgreSQL" },
  { name: "MySQL" },
  { name: "Redis" },
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "AWS" },
  { name: "CI/CD" }
];

const dataAnalysisSkills: Skill[] = [
  { name: "Python" },
  { name: "Pandas" },
  { name: "NumPy" },
  { name: "SQL" },
  { name: "Matplotlib" },
  { name: "Power BI" },
  { name: "Tableau" },
  { name: "R" }
];

const aiSkills: Skill[] = [
  { name: "TensorFlow" },
  { name: "PyTorch" },
  { name: "Transformers" },
  { name: "LangChain" },
  { name: "HuggingFace" },
  { name: "Scikit-learn" },
  { name: "OpenAI API" },
  { name: "Deep Learning" }
];

const iotCloudSkills: Skill[] = [
  { name: "MQTT" },
  { name: "Edge Computing" },
  { name: "Firebase" },
  { name: "Google Cloud" },
  { name: "Azure" },
  { name: "ESP32" },
  { name: "Raspberry Pi" },
  { name: "Serverless" }
];

export default function SkillsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            Minhas <span className="text-primary">Habilidades</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tecnologias e ferramentas que domino para o desenvolvimento de aplicações web modernas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Frontend Skills */}
          <SkillCard icon={<Code className="h-16 w-16" />} title="Frontend" skills={frontendSkills} />

          {/* Backend Skills */}
          <SkillCard icon={<Server className="h-16 w-16" />} title="Backend" skills={backendSkills} />

          {/* Database & DevOps Skills */}
          <SkillCard icon={<Database className="h-16 w-16" />} title="Database & DevOps" skills={devopsSkills} />

          {/* Data Analysis Skills */}
          <SkillCard icon={<BarChart className="h-16 w-16" />} title="Análise de Dados" skills={dataAnalysisSkills} />

          {/* AI Skills */}
          <SkillCard icon={<BrainCircuit className="h-16 w-16" />} title="Inteligência Artificial" skills={aiSkills} />

          {/* IoT & Cloud Skills */}
          <SkillCard icon={<Network className="h-16 w-16" />} title="IoT & Cloud" skills={iotCloudSkills} />
        </div>
      </div>
    </section>
  );
}

interface SkillCardProps {
  icon: React.ReactNode;
  title: string;
  skills: Skill[];
}

function SkillCard({ icon, title, skills }: SkillCardProps) {
  return (
    <Card className="bg-secondary border-0 rounded-lg shadow-xl">
      <CardContent className="p-8">
        <div className="text-primary text-4xl mb-6 flex justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold font-poppins mb-4 text-center">{title}</h3>

        <div className="flex flex-wrap gap-3 justify-center">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="skill-badge px-4 py-2 rounded-full bg-background text-gray-300 hover:text-primary hover:border-primary border border-gray-700 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
