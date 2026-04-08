import { connection } from 'next/server';
import { getSessionAndRole } from '@/lib/auth/role';
import { ReportProblemButton } from './ReportProblemButton';

export async function ReportProblem() {
  await connection();
  const session = await getSessionAndRole();

  // Only show the report button for authenticated users
  if (!session) return;

  return <ReportProblemButton />;
}
