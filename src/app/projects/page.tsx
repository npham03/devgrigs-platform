import { fetchProjectsController } from '@/controllers/project.controller';
import ProjectList from '@/views/freelancer/ProjectList';

// TODO: Nối Controller và View lại với nhau ở đây
export default async function ProjectsPage() {
    // Gọi controller lấy data
    const data = await fetchProjectsController();
    
    // Ném data sang View để render
    return <ProjectList projects={data} />;
}
