"use client";

import { Flex } from 'antd';
import PropertyType from './PropertyType';
import PriceRange from './PriceRange';
import PropertySize from './PropertySize';
import Location from './Location';
import SettingsButtons from './SettingsButtons';

export default function MenuTerreno({ activeType, setActiveType }) {
  return (
    <div  className='grid h-full content-between '>
        <div className="">
            <PropertyType activeType={activeType} setActiveType={setActiveType} />
            <PriceRange>Faixa de preço</PriceRange>
            <PropertySize>Tamanho da Propriedade</PropertySize>
        </div>
        <div className="pb-15">
            <Location />
            <SettingsButtons />
        </div>

    </div>
  );
}
