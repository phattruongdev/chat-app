import { Link } from 'react-router-dom';

export default function AuthForm({ title, subtitle, submitLabel, onSubmit, loading, error, isRegister = false }) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-line bg-white p-7 shadow-sm">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

      {error ? <div className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="mt-6 space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input name="name" className="input" minLength="2" required />
          </label>
        ) : null}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input name="email" type="email" className="input" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input name="password" type="password" className="input" minLength="6" required />
        </label>
      </div>

      <button disabled={loading} className="mt-6 w-full rounded-md bg-brand px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? 'Please wait...' : submitLabel}
      </button>

      <p className="mt-5 text-center text-sm text-gray-600">
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link className="font-semibold text-brand" to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </form>
  );
}
