import { fetchProjectsController } from '@/controllers/project.controller';
import ProjectList from '@/views/freelancer/ProjectList';
import { getCurrentUser } from '@/models/auth.model';   // 👈 sửa dòng này
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
    const loggedInUser = await getCurrentUser();

    if (!loggedInUser) {
        redirect('/login');
    }

    const data = await fetchProjectsController();

    return <ProjectList projects={data} currentRole={loggedInUser.role} />;
}