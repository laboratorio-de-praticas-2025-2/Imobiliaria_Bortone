"use client"
import Link from 'next/link';
import { Form, Input, Button, Flex } from 'antd';

export default function CadastroPage() {
  return (
    <div>
        <div className="image-header"/>
        <Flex vertical align='center' gap="large" className='login-content'>
            <h1 className='login-title text-2xl text-[var(--primary)]'>Faça seu cadastro</h1>
            <Flex vertical className='login-form-container'>
                <Form name='login' autoComplete='off'>
                    <Flex vertical align='center'>
                        <Form.Item 
                            name="name"
                            rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
                            className='login-form-item'
                        >
                            <Input placeholder='Digite seu nome:'/>
                        </Form.Item>
                        <Form.Item 
                            name="email"
                            rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
                            className='login-form-item'
                        >
                            <Input placeholder='Digite seu email:'/>
                        </Form.Item>
                        <Form.Item 
                            name="password"
                            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                            className='login-form-item'
                        >
                            <Input.Password placeholder='Digite sua senha:'/>
                        </Form.Item>
                        <Form.Item>
                            <Flex vertical align='center' gap="small">
                                <Button type="primary" htmlType="submit" className='login-button'>Entrar</Button>
                                <Flex>
                                    <Link href="/login" className='redirect-link'>Já possuo uma conta</Link>
                                </Flex>
                            </Flex>
                        </Form.Item>
                    </Flex>
                </Form>
            </Flex>
        </Flex>
    </div>
  );
}