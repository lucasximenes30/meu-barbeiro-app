import { neon } from '@neondatabase/serverless';

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment') as string;
    // Insert the comment from the form into the Postgres database
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 text-center">Add a Comment</h1>
        <form action={create} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Write a comment..." 
            name="comment" 
            required
            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
