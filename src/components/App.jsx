import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { fetchImages } from 'components/services/fetchImages';

// export default class App extends Component {
//   state = {
//     searchRequest: '',
//     images: [],
//     galleryPage: 1,
//     error: null,
//     isLoading: false,
//     showModal: null,
//   };

//   componentDidUpdate(prevProps, prevState) {
//     const prevSearch = prevState.searchRequest;
//     const currentSearch = this.state.searchRequest;
//     const prevGalleryPage = prevState.galleryPage;
//     const currentGalleryPage = this.state.galleryPage;

//     if (
//       prevSearch !== currentSearch ||
//       prevGalleryPage !== currentGalleryPage
//     ) {
//       this.updateImages();
//     }
//   }

//   updateImages() {
//     const { searchRequest, galleryPage } = this.state;
//     this.setState({ isLoading: true });
//     setTimeout(() => {
//       try {
//         fetchImages(searchRequest, galleryPage).then(data => {
//           if (!data.data.hits.length) {
//             return toast.error(
//               'There is no images found with that search request'
//             );
//           }

//           const mappedImages = data.data.hits.map(
//             ({ id, webformatURL, tags, largeImageURL }) => ({
//               id,
//               webformatURL,
//               tags,
//               largeImageURL,
//             })
//           );

//           this.setState({
//             images: [...this.state.images, ...mappedImages],
//           });
//         });
//       } catch (error) {
//         this.setState({ error });
//       } finally {
//         this.setState({ isLoading: false });
//       }
//     }, 1000);
//   }

//   handleSearchSubmit = searchRequest => {
//     this.setState({
//       searchRequest,
//       images: [],
//       galleryPage: 1,
//     });
//   };

//   loadMore = () => {
//     this.setState(prevState => ({
//       galleryPage: prevState.galleryPage + 1,
//     }));
//   };

//   showModalImage = id => {
//     const image = this.state.images.find(image => image.id === id);
//     this.setState({
//       showModal: {
//         largeImageURL: image.largeImageURL,
//         tags: image.tags,
//       },
//     });
//   };

//   closeModalImage = () => {
//     this.setState({ showModal: null });
//   };

//   render() {
//     const { images, isLoading, error, showModal, page } = this.state;
//     const isLastPage = images.length === 0 && page > 1;

//     return (
//       <>
//         <Searchbar onSearch={this.handleSearchSubmit} />
//         {error && toast.error(`Whoops, something went wrong: ${error.message}`)}
//         {isLoading && <Loader color={'#3f51b5'} size={64} />}
//         {images.length > 0 && (
//           <>
//             <ImageGallery images={images} handlePreview={this.showModalImage} />
//             {!isLoading && !isLastPage && <Button loadMore={this.loadMore} />}
//           </>
//         )}
//         {showModal && (
//           <Modal
//             lgImage={showModal.largeImageURL}
//             tags={showModal.tags}
//             closeModal={this.closeModalImage}
//           />
//         )}
//         <ToastContainer autoClose={3000} />
//       </>
//     );
//   }
// }
export default class App extends Component {
  state = {
    searchRequest: '',
    images: [],
    galleryPage: 1,
    error: null,
    isLoading: false,
    showModal: null,
    totalPages: null, // Add totalPages to the state
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchRequest, galleryPage } = this.state;
    const prevSearchRequest = prevState.searchRequest;
    const prevGalleryPage = prevState.galleryPage;

    if (
      prevSearchRequest !== searchRequest ||
      prevGalleryPage !== galleryPage
    ) {
      this.updateImages();
    }
  }

  updateImages() {
    const { searchRequest, galleryPage } = this.state;
    this.setState({ isLoading: true });

    fetchImages(searchRequest, galleryPage)
      .then(data => {
        if (!data.data.hits.length) {
          return toast.error(
            'There are no images found with that search request'
          );
        }

        const mappedImages = data.data.hits.map(
          ({ id, webformatURL, tags, largeImageURL }) => ({
            id,
            webformatURL,
            tags,
            largeImageURL,
          })
        );

        this.setState(prevState => ({
          images: [...prevState.images, ...mappedImages],
          totalPages: data.data.totalHits, // Update totalPages based on the API response
        }));
      })
      .catch(error => {
        this.setState({ error });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  handleSearchSubmit = searchRequest => {
    this.setState({
      searchRequest,
      images: [],
      galleryPage: 1,
      totalPages: null, // Reset totalPages when a new search is made
    });
  };

  loadMore = () => {
    this.setState(prevState => ({
      galleryPage: prevState.galleryPage + 1,
    }));
  };

  showModalImage = id => {
    const image = this.state.images.find(image => image.id === id);
    this.setState({
      showModal: {
        largeImageURL: image.largeImageURL,
        tags: image.tags,
      },
    });
  };

  closeModalImage = () => {
    this.setState({ showModal: null });
  };

  render() {
    const { images, isLoading, error, showModal, totalPages } = this.state;
    const isLastPage = images.length >= totalPages && totalPages !== null;

    return (
      <>
        <Searchbar onSearch={this.handleSearchSubmit} />
        {error && toast.error(`Whoops, something went wrong: ${error.message}`)}
        {isLoading && <Loader color={'#3f51b5'} size={64} />}
        {images.length > 0 && (
          <>
            <ImageGallery images={images} handlePreview={this.showModalImage} />
            {!isLoading && !isLastPage && <Button loadMore={this.loadMore} />}
          </>
        )}
        {showModal && (
          <Modal
            lgImage={showModal.largeImageURL}
            tags={showModal.tags}
            closeModal={this.closeModalImage}
          />
        )}
        <ToastContainer autoClose={3000} />
      </>
    );
  }
}
