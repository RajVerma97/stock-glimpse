import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Form from './form'

export default async function RegisterPage() {
  const session = await getServerSession()
  if (session) {
    redirect('/')
  }
  return <Form />
}
