import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized</h1>
                <p className="text-gray-700 mb-6">You do not have access to the requested page.</p>
                <div className="flexGrow">
                    <button 
                        onClick={goBack}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Unauthorized 