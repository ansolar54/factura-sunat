import React, { useEffect, useState } from 'react';
import './Pagination.css';

const Pagination = ({postsPerPage, totalPosts, changePage, nextPage, prevPage,ind}) => {
   
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(postsPerPage);
    
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

    const pages = [];
    useEffect(() => {
        if(ind == 1){
            setcurrentPage(1);
            setitemsPerPage(postsPerPage)
        }
    }, [ind])
    function handleClick(event){
        
        setcurrentPage(Number(event.target.id));
    }
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pages.push(i);
    }
    const renderPageNumbers = pages.map((number) => {
        if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
        return (
            <li
            key={number}
            id={number}
            onClick={(e)=>{changePage(number);handleClick(e);}}
            className={currentPage == number ? "numb active" : "numb"}
            >
            {number}
            </li>
        );
        } else {
        return null;
        }
    });

    function handleNextbtn(){
        setcurrentPage(currentPage + 1);

        if (currentPage + 1 > maxPageNumberLimit) {
        setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }
    }


    function handlePrevbtn(){
        setcurrentPage(currentPage - 1);

        if ((currentPage - 1) % pageNumberLimit == 0) {
        setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    }

    let pageIncrementBtn = null;
    let pageArrowIncrement = null;
    if (pages.length > maxPageNumberLimit) {
        pageIncrementBtn = <li className='dots' onClick={()=>{nextPage(currentPage);handleNextbtn()}}> &hellip; </li>;
        pageArrowIncrement = <li className="btn next" onClick={()=>{nextPage(currentPage);handleNextbtn()}} disabled={currentPage == pages[pages.length - 1] ? true : false}><span> <i className="fas fa-angle-right"></i></span></li>;
    }

    let pageDecrementBtn = null;
    let pageArrowDecrement = null;
    if (minPageNumberLimit >= 1) {
        pageDecrementBtn = <li className='dots' onClick={()=>{prevPage(currentPage);handlePrevbtn()}}> &hellip; </li>;
        pageArrowDecrement = <li className="btn prev" onClick={()=>{prevPage(currentPage);handlePrevbtn()}} disabled={currentPage == pages[0] ? true : false}><span><i className="fas fa-angle-left"></i> </span></li>;
    }

    // const handleLoadMore = () => {
    //     setitemsPerPage(itemsPerPage + 5);
    // };

    return(
        <div className="pagination">
            <ul id="ul-paginate">
                {/* <li className="btn prev" onClick={()=>{prevPage(currentPage);handlePrevbtn()}} disabled={currentPage == pages[0] ? true : false}><span><i className="fas fa-angle-left"></i> </span></li> */}
                {pageArrowDecrement}
                {pageDecrementBtn}
                {renderPageNumbers}
                {pageIncrementBtn}
                {pageArrowIncrement}
                {/* <li className="btn next" onClick={()=>{nextPage(currentPage);handleNextbtn()}} disabled={currentPage == pages[pages.length - 1] ? true : false}><span> <i className="fas fa-angle-right"></i></span></li> */}
            </ul>
        </div>
    )
}

export default Pagination;