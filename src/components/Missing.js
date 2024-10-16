import { Link } from "react-router-dom"

const Missing = () => {
    return (
        <article className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
                <p className="text-xl text-gray-700 mb-6">Page Not Found</p>
                <div className="mt-8">
                    <Link
                        to="/"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                        Visit Our Homepage
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default Missing