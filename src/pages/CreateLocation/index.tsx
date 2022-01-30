import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Marker, Map, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../componentes/Dropzone';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

import './style.css';

interface Item {
    id: number;
    name: string;
    image: string;
}

const CreateLocation: React.FC = () => {
    
    const [items, setItems] = useState<Item[]>([]);

    const [selectedMapPosition, setSelectedMapPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({ 
        name: '',
        email: '',
        whatsapp: '',
        city: '',
        uf: ''
     });

    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [msg, setMsg] = useState<string>('');

     const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect(() => {
        api.get('image').then(response => {
            setItems(response.data)
        })
    }, []);

    const handleMapClick = useCallback((e: LeafletMouseEvent): void => {
        setSelectedMapPosition([ e.latlng.lng, e.latlng.lat ]);
    }, [])

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setFormData({ ...formData, [name]: value })
    }, [formData])

    const handleSelectItem = useCallback((id: number) => {
        const alreadySelected = selectedItems.findIndex(item => item === id)

        if(alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        }else {
            setSelectedItems([ ...selectedItems, id ]);
        }
    }, [selectedItems])

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        const { name, city, email, uf, whatsapp } = formData;
        const [ latitude, longitude ] = selectedMapPosition;
        const items = selectedItems;

        const data = new FormData()
        data.append('name', name);
        data.append('city', city);
        data.append('email', email);
        data.append('uf', uf);
        data.append('whatsapp', whatsapp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(','));
        data.append('name', name);
        if(selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            await api.post('location', data);

            setMsg('Cadastrado com sucesso');

            history.push('/');
        } catch(e) {
            setMsg('Erro ao Cadastrar')
        }
    }, [formData, selectedMapPosition, selectedItems, history, selectedFile])

    return (
        <div id="page-create-location">
        <div className="content">
            <header>
                <img src={logo} alt="Coleta Seletiva"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br /> local de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    
                    <Dropzone onFileUploaded={setSelectedFile} />

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                    <h2>Endereço</h2>
                        <span>Marque o endereço no mapa</span>
                    </legend>

                    <Map center={[-23.0003700, -43.365895]} zoom={14} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedMapPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <input 
                                type="text"
                                name="city"
                                id="city"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="uf">Estado</label>
                            <input 
                                type="text"
                                name="uf"
                                id="uf"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens coletados</h2>
                        <span>Você pode marcar um ou mais ítens</span>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item => {
                            <li 
                            key={item.id} 
                            onClick={() => handleSelectItem(item.id)}
                            className={selectedItems.includes(item.id)? 'selected' : ''}
                            >
                                <img src={item.image} alt={item.name} />
                            </li>
                        })}
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar local de coleta
                </button>
                <p>{ msg? msg : '' }</p>
                <p onClick={() => setMsg('')} >X</p>
            </form>
        </div>
    </div>
    );
}

export default CreateLocation;