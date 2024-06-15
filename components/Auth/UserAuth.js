'use client';

import Image from 'next/image';
import { useAppContext } from '@/context/Context';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ReactLoading from "react-loading";
import sal from 'sal.js';

import boxedLogo from '../../public/images/logo/boxed-logo.png';
import google from '../../public/images/sign-up/google.png';
import facebook from '../../public/images/sign-up/facebook.png';
import loader from '../../public/images/ajax-loader.gif';
// import PageHead from "@/pages/Head";

const UserAuth = () => {
    const { toggleAuth, setToggleAuth, setUser } = useAppContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const searchParams = useSearchParams();
    console.log('searchParams = ', searchParams)

    const { register, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        email: '',
        password: ''
      },
      mode: 'onBlur'
    });
    const onSubmit = async (data) => { 
      setLoading(true)
      const res = await fetch('/apis/signin', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      }).then(res => res.json()).catch(err => {
        return {
          message: err.message,
        }
      }).finally(() => {
        setLoading(false)
      })
      if (res.code === '0') {
        toast.success(res.message)
        setUser(res.data.user)
        if (searchParams.get('to')) {
          router.push(searchParams.get('to'))
        } else {
          router.push('/text-generate')
        }
      } else {
        toast.error(res.message)
      }
    };

    useEffect(() => {
        sal();

        const cards = document.querySelectorAll('.bg-flashlight');

        cards.forEach(bgflashlight => {
            bgflashlight.onmousemove = function (e) {
                let x = e.pageX - bgflashlight.offsetLeft;
                let y = e.pageY - bgflashlight.offsetTop;

                bgflashlight.style.setProperty('--x', x + 'px');
                bgflashlight.style.setProperty('--y', y + 'px');
            };
        });
    }, []);
    return (
        <>
            {/* <PageHead title={`${toggleAuth ? "Log In" : "SignUp"}`} /> */}
            <div className='signup-area rainbow-section-gapTop-big' data-black-overlay='2'>
                <div className='sign-up-wrapper rainbow-section-gap'>
                    <div className='sign-up-box bg-flashlight'>
                        <div className='signup-box-top top-flashlight light-xl'>
                            <Image src={boxedLogo} width={476} height={158} alt='sign-up logo' />
                        </div>
                        <div className='separator-animated animated-true'></div>
                        <div className='signup-box-bottom'>
                            <div className='signup-box-content'>
                                <h4 className='title'>欢迎登入!</h4>
                                {/* <div className="social-btn-grp">
                  <Link className="btn-default btn-border" href="#">
                    <span className="icon-left">
                      <Image
                        src={google}
                        width={18}
                        height={18}
                        alt="Google Icon"
                      />
                    </span>
                    Login with Google
                  </Link>
                  <Link className="btn-default btn-border" href="#">
                    <span className="icon-left">
                      <Image
                        src={facebook}
                        width={18}
                        height={18}
                        alt="Google Icon"
                      />
                    </span>
                    Login with Facebook
                  </Link>
                </div> */}
                                {/* <div className="text-social-area">
                  <hr />
                  <span>Or continue with</span>
                  <hr />
                </div> */}
                                {toggleAuth ? (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='input-section mail-section'>
                                            <div className='icon'>
                                                <i className='feather-mail'></i>
                                            </div>
                                            <input
                                                name='email'
                                                {...register('email', {
                                                  required: {
                                                    value: true,
                                                    message: '请填写邮箱'
                                                  },
                                                  pattern: {
                                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                    message: '请填写正确的邮箱'
                                                  }
                                                })}
                                                type='email'
                                                placeholder='登入邮箱'
                                            />
                                        </div>
                                        <div className='input-section password-section'>
                                            <div className='icon'>
                                                <i className='feather-lock'></i>
                                            </div>
                                            <input
                                                name='password'
                                                {...register('password', {
                                                  required: true,
                                                })}
                                                type='password'
                                                placeholder='密码'
                                            />
                                            
                                        </div>
                                        {/* <div className="forget-text">
                      <Link className="btn-read-more" href="#">
                        <span>Forgot password</span>
                      </Link>
                    </div> */}          {errors.email && <p style={{ textAlign: 'left', color: 'red', marginTop: '10px' }}>{errors.email.message}</p>}
                                        <button disabled={loading} type='submit' className='btn-default' style={{ display: 'flex', justifyContent: 'center'}}>
                                          { loading && <ReactLoading style={{ height: '20px', width: '20px', marginRight: '10px' }} type="spin" color="#fff" /> }登入
                                        </button>
                                    </form>
                                ) : (
                                    <form>
                                        <div className='input-section mail-section'>
                                            <div className='icon'>
                                                <i className='feather-user'></i>
                                            </div>
                                            <input type='text' placeholder='Enter Your Name' />
                                        </div>
                                        <div className='input-section mail-section'>
                                            <div className='icon'>
                                                <i className='feather-mail'></i>
                                            </div>
                                            <input type='email' placeholder='Enter email address' />
                                        </div>
                                        <div className='input-section password-section'>
                                            <div className='icon'>
                                                <i className='feather-lock'></i>
                                            </div>
                                            <input type='password' placeholder='Create Password' />
                                        </div>
                                        <div className='input-section password-section'>
                                            <div className='icon'>
                                                <i className='feather-lock'></i>
                                            </div>
                                            <input type='password' placeholder='Confirm Password' />
                                        </div>
                                        {/* <button type="submit" className="btn-default">
                      Sign Up
                    </button> */}
                                    </form>
                                )}
                            </div>
                            {/* <div className="signup-box-footer">
                <div className="bottom-text">
                  Don&apos;t have an account?
                  <Link
                    className="btn-read-more ps-2"
                    href="#"
                    onClick={() => setToggleAuth(!toggleAuth)}
                  >
                    {toggleAuth ? <span>Sign Up</span> : <span>Sign In</span>}
                  </Link>
                </div>
              </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserAuth;
