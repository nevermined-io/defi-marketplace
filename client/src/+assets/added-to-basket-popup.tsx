import React, { createRef } from 'react'
import { BEM, UiText, UiPopup, UiPopupHandlers, UiButton } from '@nevermined-io/styles'
import styles from './added-to-basket-popup.module.scss'
import Router from 'next/router'



interface AddedToBasketPopupProps {
  closePopup : (event:any)=> void,
  popupRef : RefObject<UiPopupHandlers>
}


const b = BEM('added-to-basket-popup', styles)

export function AddedToBasketPopup({closePopup, popupRef}: AddedToBasketPopupProps) {
  // const popupRef = createRef<UiPopupHandlers>()


  return (
    <>
      <UiPopup ref={popupRef}>
        <div className={b('basket-popup')}>
          <img src="/assets/check_mark.svg" width="73px" />
          <UiText style={{ color: '#2E405A', margin: '72px 0 25px' }} type="h3">Added to basket</UiText>
          <div className={b('popup-text')}>
            You can now view your basket contents from by clicking the navigation icon&nbsp;&nbsp;
            <img src="/assets/basket_icon.svg" width="16px" />
          </div>
          <div className={b('popup-buttons')}>
            <UiButton cover style={{ padding: '0', width: '170px' }} onClick={closePopup}>Back To Search</UiButton>
            <UiButton cover style={{ padding: '0', width: '170px' }} type="alt" onClick={() => Router.push('/checkout')}>Go To Basket</UiButton>
          </div>
        </div>
      </UiPopup>
    </>
  )


}
