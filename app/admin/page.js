import React from 'react'
import { redirect } from 'next/navigation';

export default function page() {
    redirect('/admin/dashboard');
  return (
    <div>
      redirecting to dashboard page
    </div>
  )
}
