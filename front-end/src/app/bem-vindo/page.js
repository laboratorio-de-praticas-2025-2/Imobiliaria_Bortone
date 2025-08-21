"use client"
import { Button, Flex } from 'antd';
import SocialMediaIcon from '@/components/SocialMediaIcon';
import { socialMedias } from '@/constants/socialMedias';

export default function BoasVindasPage() {
  return (
    <div>
        <div className="image-header"/>
        <Flex vertical align='center' gap="large" className='boas-vindas-content'>
            <h1 className='login-title text-2xl text-[var(--primary)]'>Bem Vindo!</h1>
            <Flex vertical className='login-form-container' gap="large" align='center'>
                <Button type="primary" htmlType="submit" className='login-button w-[100%]' href='/cadastro'>Criar uma conta</Button>
                <Button type="primary" htmlType="submit" className='login-sec-button w-[100%]' href='/login'>Login</Button>
                <Flex gap={14}>
                    {socialMedias.map((media) => (
                        <SocialMediaIcon key={media.alt} src={media.src} alt={media.alt} />
                    ))}
                </Flex>
            </Flex>
        </Flex>
    </div>
  );
}