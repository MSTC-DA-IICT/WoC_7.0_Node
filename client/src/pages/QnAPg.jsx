import React, { useEffect } from 'react';
import { useQnAStore } from '../store/QnAStore';

const QnAPg = () => {

    const { what, getCategories, addCategory, removeCategory, getAnswers, sendQuestion, sendAnswer, getQuestions, categories } = useQnAStore()

    useEffect(() => {
        const fetchCat = async () => {
            addCategory("LA")
            getCategories()
        }
        fetchCat()
    }, [])

    return (
        <div className='m-4'>
            {what === "category" &&
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ">
                    {
                        categories.map((category, index) => (
                            <div className="card bg-primary text-primary-content text-2xl justify-center items-center font-bold flex">
                                <div className="card-body">
                                    {category}
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
            {/* {what === "qna" && 

            } */}

        </div>
    );
}

export default QnAPg;
