// Copyright 2020 Chaos Mesh Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// See the License for the specific language governing permissions and
// limitations under the License.

package physicalmachinechaos

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/go-logr/logr"
	"go.uber.org/fx"
	"sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/chaos-mesh/chaos-mesh/api/v1alpha1"
	"github.com/chaos-mesh/chaos-mesh/controllers/common"
)

type Impl struct {
	client.Client
	Log logr.Logger
}

func (impl *Impl) Apply(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
	impl.Log.Info("apply physical machine chaos")
	address := records[index].Id

	physicalMachinechaos := obj.(*v1alpha1.PhysicalMachineChaos)

	url := fmt.Sprintf("%s/api/attack/%s", address, physicalMachinechaos.Spec.Action)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer([]byte(physicalMachinechaos.Spec.ExpInfo)))
	if err != nil {
		impl.Log.Error(err, "fail to generate http request")
		return v1alpha1.NotInjected, err
	}
	req.Header.Set("X-Custom-Header", "myvalue")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		impl.Log.Error(err, "do http request")
		return v1alpha1.NotInjected, err
	}
	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))

	// TODO: get expid
	return v1alpha1.Injected, nil
}

func (impl *Impl) Recover(ctx context.Context, index int, records []*v1alpha1.Record, obj v1alpha1.InnerObject) (v1alpha1.Phase, error) {
	/*
		decodedContainer, err := impl.decoder.DecodeContainerRecord(ctx, records[index])
		if decodedContainer.PbClient != nil {
			defer decodedContainer.PbClient.Close()
		}
		if err != nil {
			if utils.IsFailToGet(err) {
				// pretend the disappeared container has been recovered
				return v1alpha1.NotInjected, nil
			}
			return v1alpha1.Injected, err
		}

		dnschaos := obj.(*v1alpha1.DNSChaos)

		// get dns server's ip used for chaos
		service, err := pod.GetService(ctx, impl.Client, "", config.ControllerCfg.Namespace, config.ControllerCfg.DNSServiceName)
		if err != nil {
			impl.Log.Error(err, "fail to get service")
			return v1alpha1.Injected, err
		}
		impl.Log.Info("Cancel DNS chaos to DNS service", "ip", service.Spec.ClusterIP)

		err = impl.cancelDNSServerRules(service.Spec.ClusterIP, config.ControllerCfg.DNSServicePort, dnschaos.Name)
		if err != nil {
			impl.Log.Error(err, "fail to cancelDNSServerRules")
			return v1alpha1.Injected, err
		}

		_, err = decodedContainer.PbClient.SetDNSServer(ctx, &pb.SetDNSServerRequest{
			ContainerId: decodedContainer.ContainerId,
			Enable:      false,
			EnterNS:     true,
		})
		if err != nil {
			impl.Log.Error(err, "recover pod for DNS chaos")
			return v1alpha1.Injected, err
		}
	*/

	return v1alpha1.Injected, nil
}

func NewImpl(c client.Client, log logr.Logger) *common.ChaosImplPair {
	return &common.ChaosImplPair{
		Name:   "physicalmachinechaos",
		Object: &v1alpha1.PhysicalMachineChaos{},
		Impl: &Impl{
			Client: c,
			Log:    log.WithName("physicalmachinechaos"),
		},
	}
}

var Module = fx.Provide(
	fx.Annotated{
		Group:  "impl",
		Target: NewImpl,
	},
)
