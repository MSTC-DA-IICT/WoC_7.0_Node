import React, { useEffect } from 'react';
import { useQnAStore } from '../store/QnAStore';

const QnAPg = () => {

    const { what, getCategories, addCategory, removeCategory, getAnswers, sendQuestion, sendAnswer, getQuestions, categories } = useQnAStore()

    useEffect(() => {
        const fetchCat = async () => {
            // addCategory("LA")
            getCategories()
        }
        fetchCat()
    }, [])


    const truncateText = (text, length) => {
        if (text.length > length) {
            return text.substring(0, length) + '...';
        }
        return text;
    };

    return (
        <div className='m-4'>
            {/* {what === "category" &&
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ">
                    {
                        categories.map((category, index) => (
                            <div className="card bg-primary text-primary-content text-2xl justify-center items-center font-bold flex"
                                onClick={handleCat}>
                                <div className="card-body">
                                    {category}
                                </div>
                            </div>
                        ))
                    }
                </div>
            } */}
            {/* {what === "qna" && 

            } */}
            {/* <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6 mx-2'>
                <div className="card outline outline-primary outline-2 shadow-2xl flex flex-col m-2 hover:bg-primary hover:text-black transition-colors">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                            alt="Album"
                        />
                    </figure>
                    <div className="card-body text-xl">
                        <p>{truncateText("Click the button to listen on Spotiwhy app. Click the button to listen on Spotiwhy app.", 50)}</p>
                    </div>
                </div>
            </div> */}
            {/* <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div
                    className="chat chat-start"
                >
                    <div className=" chat-image avatar">
                        <div className="size-10 rounded-full border">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                                alt="Album"
                            />
                        </div>
                    </div>

                    <div className="chat-bubble flex flex-col">

                        <img
                            src="https://img.daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.webp"
                            alt="Album"
                            className="sm:max-w-[200px] rounded-md mb-2"
                        />

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, ab adipisci nemo veritatis ea quis cupiditate unde, rem corporis laboriosam, ullam hic atque. Odio deleniti similique atque asperiores distinctio nisi!</p>
                    </div>
                </div>
            </div> */}

        </div>
    );
}

export default QnAPg;
