import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'


export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo
}

export const specialityData = [
    {
        speciality: 'General Physician',
        image: General_physician
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatricians',
        image: Pediatricians
    },
    {
        speciality: 'Neurologist',
        image: Neurologist
    },
    {
        speciality: 'Gastroenterologist',
        image: Gastroenterologist
    },
]

export const doctors = [
    {
        _id: 'doc1',
        name: 'Dr. Chirag Deshpande',
        image: doc1,
        speciality: 'General Physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Chirag Deshpande is a dedicated General Physician with 4 years of experience in providing comprehensive medical care. He focuses on preventive healthcare, accurate diagnosis, and effective treatment plans to ensure the overall well-being of his patients. He is known for his patient-friendly approach and commitment to quality healthcare.',
        fees: '150 ₹',
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc2',
        name: 'Dr. Natasha Larson',
        image: doc2,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Natasha Larson is a skilled Gynecologist with 3 years of experience in women’s healthcare. She specializes in reproductive health, prenatal care, and managing common gynecological conditions. She is dedicated to providing compassionate care, ensuring patient comfort, and promoting overall well-being through personalized treatment plans.',
        fees: '180 ₹',
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc3',
        name: 'Dr. Siddharth Patel',
        image: doc3,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Siddharth Patel is a dedicated Dermatologist with 1 year of experience in treating skin, hair, and nail conditions. He focuses on accurate diagnosis and effective treatment for issues such as acne, allergies, and infections. He aims to provide personalized care and help patients maintain healthy skin through proper guidance and treatment.',
        fees: '300 ₹',
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc4',
        name: 'Dr. Jameson',
        image: doc4,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jameson is a caring Pediatrician with 2 years of experience in child healthcare. He focuses on monitoring growth and development, treating common childhood illnesses, and providing vaccinations. He is committed to creating a friendly and comfortable environment for children while guiding parents on maintaining their child’s health and well-being.',
        fees: '400 ₹',
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc5',
        name: 'Dr. Jennifer Garcia',
        image: doc5,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Jennifer Garcia is an experienced Neurologist with 4 years of expertise in diagnosing and treating disorders of the brain and nervous system. She specializes in managing conditions such as headaches, migraines, epilepsy, and nerve-related issues. She is dedicated to providing patient-focused care with accurate diagnosis and effective treatment plans.',
        fees: '550 ₹',
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc6',
        name: 'Dr. Andrew Williams',
        image: doc6,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Andrew Williams is a skilled Neurologist with 4 years of experience in diagnosing and treating neurological disorders. He focuses on conditions such as migraines, epilepsy, stroke management, and nerve-related disorders. He is committed to delivering precise diagnosis and personalized treatment to improve patients’ neurological health and quality of life.',
        fees: '500 ₹',
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc7',
        name: 'Dr. Christopher Davis',
        image: doc7,
        speciality: 'General Physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Christopher Davis is a dedicated General Physician with 4 years of experience in providing comprehensive healthcare. He focuses on preventive medicine, early diagnosis, and effective treatment of various medical conditions. He is known for his patient-centered approach and commitment to ensuring long-term health and well-being.',
        fees: '530 ₹',
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc8',
        name: 'Dr. Sharan',
        image: doc8,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Sharan is a dedicated Gynecologist with 3 years of experience in women’s health and reproductive care. She specializes in prenatal care, menstrual health, and managing common gynecological conditions. She is committed to providing compassionate and personalized care, ensuring patient comfort and well-being.',
        fees: '600 ₹',
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc9',
        name: 'Dr. Aira sharma',
        image: doc9,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Aira Sharma is a passionate Dermatologist with 1 year of experience in treating skin, hair, and nail conditions. She focuses on diagnosing issues such as acne, pigmentation, and allergies, and provides effective treatment plans. She is dedicated to helping patients achieve healthy skin through proper care and guidance.',
        fees: '370 ₹',
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: doc10,
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Jeffrey King is a dedicated Pediatrician with 2 years of experience in child healthcare. He focuses on treating common childhood illnesses, monitoring growth and development, and providing vaccinations. He ensures a friendly and supportive environment for children while guiding parents on maintaining their child’s health and well-being.',
        fees: '480 ₹',
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc11',
        name: 'Dr. Vasundhara Malhotra',
        image: doc11,
        speciality: 'Gastroenterologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Vasundhara Malhotra is an experienced Gastroenterologist with 4 years of expertise in diagnosing and treating digestive system disorders. She specializes in conditions such as acidity, ulcers, liver issues, and gastrointestinal infections. She is committed to providing accurate diagnosis and effective treatment while promoting long-term digestive health.',
        fees: '560 ₹',
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc12',
        name: 'Dr. Amogh',
        image: doc12,
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Amogh is an experienced Neurologist with 4 years of expertise in diagnosing and treating disorders of the brain and nervous system. He specializes in conditions such as migraines, epilepsy, and nerve-related issues. He is dedicated to providing precise diagnosis, effective treatment, and continuous care to improve patients’ quality of life.',
        fees: '367 ₹',
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: doc13,
        speciality: 'General Physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Chloe Evans is an experienced General Physician with 4 years of practice in diagnosing and treating a wide range of medical conditions. She focuses on preventive healthcare, early diagnosis, and personalized treatment plans. She is known for her attentive approach and commitment to ensuring the overall well-being of her patients.',
        fees: '850 ₹',
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc14',
        name: 'Dr. Ajith',
        image: doc14,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Ajith is a dedicated Gynecologist with 3 years of experience in women’s healthcare. He specializes in reproductive health, prenatal care, and the treatment of common gynecological conditions. He focuses on providing compassionate care and ensuring patient comfort through personalized treatment plans.',
        fees: '750 ₹',
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: doc15,
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Amelia Hill is a passionate Dermatologist with 1 year of experience in treating skin, hair, and nail conditions. She focuses on issues such as acne, pigmentation, and skin allergies, providing effective and personalized treatment plans. She is dedicated to helping patients maintain healthy and confident skin.',
        fees: '650 ₹',
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
]