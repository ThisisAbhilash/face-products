import React from 'react';
import { SORT_FIELDS, defaultConfig, getAddedDateText, generateUniqueRandom } from './utils';
import { GET_PRODUCT } from './api';
import Loader from 'react-loader';
import worker from './worker';
import WebWorkerSetUp from './webworkersetup';

const GenerateRandom = generateUniqueRandom(1,999);
const EachItem = ({id, price, size, face, date}) => {
    return(
        <div className="card" style={{width: "18rem"}}>
            <div className="card-body">
                <h5 className="card-title">Id - {id}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Price: $ {(price / 100).toFixed(2)}</h6>
                <p style={{fontSize: `${size}px`}}>{face}</p>
                <label className="card-link">{getAddedDateText(date)}</label>
            </div>
        </div>
    )
}
const Advertisement = props => {
    let imgSrc = `/ads/?r=${props.randomId}`;
    return(
        <div>
            <img src={imgSrc} />
        </div>
    )
}

export default class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            nextProducts: [],
            sortOn: '',
            page: 1,
            limit: defaultConfig.limit,
            isLoading: true
        }
        this.handleScroll = this.handleScroll.bind(this);
    }
    async componentDidMount() {
        this.worker = new WebWorkerSetUp(worker);
        this.worker.addEventListener("message", event => {
            this.setState({ nextProducts: event.data });
        });
        window.addEventListener('scroll', this.handleScroll);
        let products = await GET_PRODUCT(1, this.state.limit);
        this.setState({ isLoading: false, products });

        this.worker.postMessage([2, this.state.limit]);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        this.worker.terminate();
    }
    handleScroll(element) {
        let offsetHeight = document.getElementById('app').offsetHeight;
        let targetHeight = offsetHeight * 0.8; //if user has scrolled more than 80%, time to load more data

        if(window.scrollY > targetHeight) {
            this.setState({isLoading: true});
            let { page, limit, sortOn, products, nextProducts } = this.state;
            if(nextProducts.length !== 0) {
                products = [...products, ...nextProducts];
                let nextPage = page + 1;
                this.setState({ isLoading: false, page: nextPage, products });
                this.worker.postMessage([nextPage + 1, limit, sortOn]);
            }
            else {
                this.setState({ isEnd: true });
            }
        }
    }
    onSortList = async sortOn => {
        this.setState({ isLoading: true });
        let { limit } = this.state;
        let products = await GET_PRODUCT( 1, limit, sortOn );
        this.setState({ isLoading: false, products, sortOn, nextProducts: [], page: 1});

        this.worker.postMessage([2, this.state.limit, sortOn]);
    }
    render() {
        let arrowCode = <i className="fa fa-arrow-down" style={{color:"blue"}}></i>;
        let items = [];
        for(let i = 0; i < this.state.products.length; i++) {
            if((i + 1) % defaultConfig.show_adv_after_every === 0) {
                let randomNumber = GenerateRandom();
                items.push(<Advertisement key={i} randomId={randomNumber} />);
            }
            items.push(<EachItem key={this.state.products[i].id} {...this.state.products[i]}/>)
        }
        return(
            <React.Fragment>
                <label><strong>sort by</strong>&nbsp;&nbsp;
                    <span onClick={() => this.onSortList(SORT_FIELDS.PRICE)} className={`${this.state.sortOn === SORT_FIELDS.PRICE ? 'selectedSort' : 'cursor'}`}>Price {this.state.sortOn === SORT_FIELDS.PRICE && <span>{arrowCode}</span>}</span>&nbsp;&nbsp;
    
                    <span onClick={() => this.onSortList(SORT_FIELDS.SIZE)} className={`${this.state.sortOn === SORT_FIELDS.SIZE ? 'selectedSort' : 'cursor'}`}>Size {this.state.sortOn === SORT_FIELDS.SIZE && <span>{arrowCode}</span>}</span>&nbsp;&nbsp;
    
                    <span onClick={() => this.onSortList(SORT_FIELDS.ID)} className={`${this.state.sortOn === SORT_FIELDS.ID ? 'selectedSort' : 'cursor'}`}>Id </span>{this.state.sortOn === SORT_FIELDS.ID && <span>{arrowCode}</span>}
                </label>
                <div className="grid-container">
                    <Loader loaded={!this.state.isLoading}>
                        {items}
                        {this.state.isEnd && <label>~ end of catalogue ~</label>}
                    </Loader>
                </div>
            </React.Fragment>
        )
    }
}