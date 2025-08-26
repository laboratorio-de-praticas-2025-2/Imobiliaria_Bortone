"use client";

import { Flex } from 'antd';
import PropertyType from './PropertyType';
import PriceRange from './PriceRange';
import RoomsNumber from './RoomsNumber';
import Options from './Options';
import PropertySize from './PropertySize';
import SettingsButtons from './SettingsButtons';

export default function MenuCasa({ activeType, setActiveType }) {
  return (
    <div className='grid h-full'>
        <div>
            <PropertyType activeType={activeType} setActiveType={setActiveType} />
            <PriceRange>Faixa de preço</PriceRange>
            <RoomsNumber />
            
            <Options />
            <PropertySize>Tamanho da Propriedade</PropertySize>
            <SettingsButtons />

        </div>
    </div>
  );
}
