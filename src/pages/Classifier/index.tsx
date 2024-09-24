import ClassifierBody from "@/components/Classifier";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Classifier: React.FC = () => {
    return (
        <div>
            <Header />
                <ClassifierBody />
            <Footer />
        </div>
    );
};

export default Classifier;
